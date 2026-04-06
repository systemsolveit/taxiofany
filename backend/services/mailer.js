const nodemailer = require('nodemailer');
const config = require('../config');
const { IntegrationSetting, EmailTemplate } = require('../models');
const { logger } = require('../middlewares/logger');

const MAIL_KEY = 'mail';
const SITE_KEY = 'site';
const NOTIFICATIONS_KEY = 'notifications';

function toBool(value, fallback = false) {
  if (typeof value === 'boolean') {
    return value;
  }

  const text = String(value || '').trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(text)) {
    return true;
  }
  if (['0', 'false', 'no', 'off'].includes(text)) {
    return false;
  }
  return fallback;
}

function normalizeSmtpProvider(value) {
  const v = String(value || 'custom').trim().toLowerCase();
  if (v === 'gmail' || v === 'office365') {
    return v;
  }
  return 'custom';
}

function normalizeMailConfig(source = {}) {
  const hasProvider =
    source &&
    Object.prototype.hasOwnProperty.call(source, 'smtpProvider') &&
    source.smtpProvider !== undefined &&
    source.smtpProvider !== null &&
    String(source.smtpProvider).trim() !== '';

  return {
    smtpProvider: hasProvider ? normalizeSmtpProvider(source.smtpProvider) : undefined,
    smtpHost: String(source.smtpHost || '').trim(),
    smtpPort: Number(source.smtpPort) || 0,
    smtpSecure: toBool(source.smtpSecure, false),
    smtpUser: String(source.smtpUser || '').trim(),
    smtpPass: String(source.smtpPass || '').trim(),
    smtpFrom: String(source.smtpFrom || '').trim(),
    contactRecipientEmail: String(source.contactRecipientEmail || '').trim().toLowerCase(),
  };
}

async function getDbMailConfig() {
  const record = await IntegrationSetting.findOne({ key: MAIL_KEY }).lean();
  if (!record || !record.value || typeof record.value !== 'object') {
    return null;
  }

  return normalizeMailConfig(record.value);
}

function getEnvMailConfig() {
  return normalizeMailConfig({
    smtpHost: config.smtpHost,
    smtpPort: config.smtpPort,
    smtpSecure: config.smtpSecure,
    smtpUser: config.smtpUser,
    smtpPass: config.smtpPass,
    smtpFrom: config.smtpFrom,
    contactRecipientEmail: config.contactRecipientEmail,
  });
}

function mergeMailConfig(base = {}, override = {}) {
  const normalizedBase = normalizeMailConfig(base);
  const normalizedOverride = normalizeMailConfig(override);
  return {
    smtpProvider:
      normalizedOverride.smtpProvider !== undefined ? normalizedOverride.smtpProvider : normalizedBase.smtpProvider,
    smtpHost: normalizedOverride.smtpHost || normalizedBase.smtpHost,
    smtpPort: normalizedOverride.smtpPort || normalizedBase.smtpPort,
    smtpSecure: normalizedOverride.smtpSecure,
    smtpUser: normalizedOverride.smtpUser || normalizedBase.smtpUser,
    smtpPass: normalizedOverride.smtpPass || normalizedBase.smtpPass,
    smtpFrom: normalizedOverride.smtpFrom || normalizedBase.smtpFrom,
    contactRecipientEmail: normalizedOverride.contactRecipientEmail || normalizedBase.contactRecipientEmail,
  };
}

async function getResolvedMailConfig(override = null) {
  const dbConfig = await getDbMailConfig();
  const envConfig = getEnvMailConfig();
  const base = dbConfig ? mergeMailConfig(envConfig, dbConfig) : envConfig;

  let merged = base;
  if (override && typeof override === 'object') {
    merged = mergeMailConfig(base, override);
  }

  if (!merged.smtpProvider) {
    merged = { ...merged, smtpProvider: 'custom' };
  }

  return merged;
}

function isMailConfigUsable(mailConfig = {}) {
  return Boolean(mailConfig.smtpHost && mailConfig.smtpPort && mailConfig.smtpFrom && mailConfig.contactRecipientEmail);
}

function getTransport(mailConfig) {
  const provider = normalizeSmtpProvider(mailConfig.smtpProvider || 'custom');
  const port = Number(mailConfig.smtpPort);

  if (provider === 'gmail' && mailConfig.smtpUser && mailConfig.smtpPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailConfig.smtpUser,
        pass: mailConfig.smtpPass,
      },
    });
  }

  const opts = {
    host: mailConfig.smtpHost,
    port,
    secure: Boolean(mailConfig.smtpSecure),
    auth: mailConfig.smtpUser
      ? {
          user: mailConfig.smtpUser,
          pass: mailConfig.smtpPass,
        }
      : undefined,
  };

  if (port === 587 && !mailConfig.smtpSecure) {
    opts.requireTLS = true;
  }

  return nodemailer.createTransport(opts);
}

async function sendContactSubmissionEmail(submission) {
  const mailConfig = await getResolvedMailConfig();
  if (!isMailConfigUsable(mailConfig)) {
    return {
      sent: false,
      reason: 'SMTP_NOT_CONFIGURED',
    };
  }

  const transporter = getTransport(mailConfig);
  const safe = submission || {};

  const subject = `[Contact] ${safe.subject || 'New inquiry'} - ${safe.fullName || 'Unknown sender'}`;
  const text = [
    `New contact submission received`,
    `Name: ${safe.fullName || '-'}`,
    `Email: ${safe.email || '-'}`,
    `Phone: ${safe.phone || '-'}`,
    `Subject: ${safe.subject || '-'}`,
    `Source: ${safe.sourcePage || '-'}`,
    '',
    `Message:`,
    `${safe.message || ''}`,
  ].join('\n');

  const html = `
    <h2>New Contact Submission</h2>
    <p><strong>Name:</strong> ${safe.fullName || '-'}</p>
    <p><strong>Email:</strong> ${safe.email || '-'}</p>
    <p><strong>Phone:</strong> ${safe.phone || '-'}</p>
    <p><strong>Subject:</strong> ${safe.subject || '-'}</p>
    <p><strong>Source:</strong> ${safe.sourcePage || '-'}</p>
    <hr />
    <p style="white-space: pre-line;">${safe.message || ''}</p>
  `;

  await transporter.sendMail({
    from: mailConfig.smtpFrom,
    to: mailConfig.contactRecipientEmail,
    replyTo: safe.email || undefined,
    subject,
    text,
    html,
  });

  return {
    sent: true,
  };
}

async function sendTestEmail(override = null) {
  const rawOverride = override && typeof override === 'object' ? { ...override } : {};
  const testTo = String(rawOverride.testTo || '').trim().toLowerCase();
  delete rawOverride.testTo;

  const mailConfig = await getResolvedMailConfig(rawOverride);
  if (!isMailConfigUsable(mailConfig)) {
    return {
      sent: false,
      reason: 'SMTP_NOT_CONFIGURED',
    };
  }

  const to = testTo || mailConfig.contactRecipientEmail;
  if (!to) {
    return { sent: false, reason: 'NO_RECIPIENT' };
  }

  const transporter = getTransport(mailConfig);
  await transporter.sendMail({
    from: mailConfig.smtpFrom,
    to,
    subject: '[Taxiofany] SMTP integration test',
    text: 'This is a test email from Taxiofany admin settings integration.',
    html: '<p>This is a test email from <strong>Taxiofany admin settings integration</strong>.</p>',
  });

  return {
    sent: true,
  };
}

function applyPlaceholderMap(text, map) {
  let out = String(text || '');
  Object.keys(map).forEach((key) => {
    const re = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    out = out.replace(re, map[key] == null ? '' : String(map[key]));
  });
  return out;
}

async function getSitePrimaryColor() {
  const record = await IntegrationSetting.findOne({ key: SITE_KEY }).lean();
  const v = record && record.value;
  if (v && typeof v === 'object' && v.primaryColor) {
    const c = String(v.primaryColor).trim();
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c)) {
      return c;
    }
  }
  return '#f59e0b';
}

async function getNotificationsMailPrefs() {
  const record = await IntegrationSetting.findOne({ key: NOTIFICATIONS_KEY }).lean();
  const value = record && record.value && typeof record.value === 'object' ? record.value : {};
  return {
    rideStatusEmailTemplateId: value.rideStatusEmailTemplateId ? String(value.rideStatusEmailTemplateId) : null,
    sendOnStatusChange: value.sendOnStatusChange !== false,
  };
}

function buildThemedRideEmailHtml({ primaryColor, innerHtml }) {
  const bar = primaryColor || '#f59e0b';
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f1f5f9;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
        <tr><td style="background:${bar};color:#fff;padding:16px 20px;font-size:18px;font-weight:600;">Taxiofany</td></tr>
        <tr><td style="padding:24px 20px;color:#334155;line-height:1.6;">${innerHtml}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildRideEmailInnerFromTemplate(templateDoc, map) {
  const hero = applyPlaceholderMap(templateDoc.heroTitle || '', map);
  const sub = applyPlaceholderMap(templateDoc.heroDescription || '', map);
  const bodyTitle = applyPlaceholderMap(templateDoc.bodyTitle || '', map);
  const body = applyPlaceholderMap(templateDoc.bodyContent || '', map);
  const ctaLabel = applyPlaceholderMap(templateDoc.ctaLabel || '', map);
  const ctaUrl = applyPlaceholderMap(templateDoc.ctaUrl || '', map);

  let inner = '';
  if (hero) {
    inner += `<h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">${hero}</h1>`;
  }
  if (sub) {
    inner += `<p style="margin:0 0 16px;color:#64748b;">${sub}</p>`;
  }
  if (bodyTitle) {
    inner += `<h2 style="margin:16px 0 8px;font-size:16px;color:#0f172a;">${bodyTitle}</h2>`;
  }
  inner += `<div style="white-space:pre-wrap;">${body.replace(/\n/g, '<br/>')}</div>`;
  if (ctaLabel && ctaUrl) {
    inner += `<p style="margin-top:20px;"><a href="${ctaUrl}" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">${ctaLabel}</a></p>`;
  }
  return inner;
}

function bookingToPlaceholderMap(booking, previousStatus, newStatus) {
  const b = booking || {};
  const rideDate =
    b.rideDate instanceof Date
      ? b.rideDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : b.requestedDateText || '';
  return {
    customerName: b.customerName || '',
    bookingCode: b.bookingCode || '',
    status: newStatus || b.status || '',
    previousStatus: previousStatus || '',
    pickup: b.pickupLocation || '',
    destination: b.destinationLocation || '',
    rideDate,
    fareAmount: b.fareAmount != null ? String(b.fareAmount) : '',
  };
}

async function sendRideStatusUpdateEmail({ booking, previousStatus, newStatus }) {
  try {
    const prefs = await getNotificationsMailPrefs();
    if (!prefs.sendOnStatusChange) {
      return { sent: false, reason: 'NOTIFICATIONS_DISABLED' };
    }

    const email = String(booking && booking.customerEmail || '').trim().toLowerCase();
    if (!email) {
      logger.warn({ reason: 'ride_status_email_no_customer_email', bookingId: booking && booking._id });
      return { sent: false, reason: 'NO_CUSTOMER_EMAIL' };
    }

    let templateDoc = null;
    if (prefs.rideStatusEmailTemplateId) {
      templateDoc = await EmailTemplate.findById(prefs.rideStatusEmailTemplateId).lean();
    }
    if (!templateDoc) {
      templateDoc = await EmailTemplate.findOne({ slug: 'ride-status-update' }).lean();
    }
    if (!templateDoc) {
      logger.warn({ reason: 'ride_status_email_no_template' });
      return { sent: false, reason: 'NO_TEMPLATE' };
    }

    const map = bookingToPlaceholderMap(booking, previousStatus, newStatus);
    const subject = applyPlaceholderMap(templateDoc.subject || 'Ride update', map);
    const innerHtml = buildRideEmailInnerFromTemplate(templateDoc, map);
    const primaryColor = await getSitePrimaryColor();
    const html = buildThemedRideEmailHtml({ primaryColor, innerHtml });
    const text = `${subject}\n\n${applyPlaceholderMap(templateDoc.bodyContent || '', map)}`;

    const mailConfig = await getResolvedMailConfig();
    if (!isMailConfigUsable(mailConfig)) {
      return { sent: false, reason: 'SMTP_NOT_CONFIGURED' };
    }

    const transporter = getTransport(mailConfig);
    await transporter.sendMail({
      from: mailConfig.smtpFrom,
      to: email,
      subject,
      text,
      html,
    });

    return { sent: true };
  } catch (error) {
    logger.error({ err: error, msg: 'sendRideStatusUpdateEmail failed' });
    return { sent: false, reason: 'SEND_ERROR' };
  }
}

module.exports = {
  getResolvedMailConfig,
  isMailConfigUsable,
  sendContactSubmissionEmail,
  sendTestEmail,
  sendRideStatusUpdateEmail,
  applyPlaceholderMap,
  buildThemedRideEmailHtml,
  buildRideEmailInnerFromTemplate,
  bookingToPlaceholderMap,
  getSitePrimaryColor,
  getNotificationsMailPrefs,
};
