const nodemailer = require('nodemailer');
const config = require('../config');
const { IntegrationSetting } = require('../models');

const MAIL_KEY = 'mail';

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

function normalizeMailConfig(source = {}) {
  return {
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

  if (override && typeof override === 'object') {
    return mergeMailConfig(base, override);
  }

  return base;
}

function isMailConfigUsable(mailConfig = {}) {
  return Boolean(mailConfig.smtpHost && mailConfig.smtpPort && mailConfig.smtpFrom && mailConfig.contactRecipientEmail);
}

function getTransport(mailConfig) {
  return nodemailer.createTransport({
    host: mailConfig.smtpHost,
    port: Number(mailConfig.smtpPort),
    secure: Boolean(mailConfig.smtpSecure),
    auth: mailConfig.smtpUser
      ? {
          user: mailConfig.smtpUser,
          pass: mailConfig.smtpPass,
        }
      : undefined,
  });
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
  const mailConfig = await getResolvedMailConfig(override);
  if (!isMailConfigUsable(mailConfig)) {
    return {
      sent: false,
      reason: 'SMTP_NOT_CONFIGURED',
    };
  }

  const transporter = getTransport(mailConfig);
  await transporter.sendMail({
    from: mailConfig.smtpFrom,
    to: mailConfig.contactRecipientEmail,
    subject: '[Taxiofany] SMTP integration test',
    text: 'This is a test email from Taxiofany admin settings integration.',
    html: '<p>This is a test email from <strong>Taxiofany admin settings integration</strong>.</p>',
  });

  return {
    sent: true,
  };
}

module.exports = {
  getResolvedMailConfig,
  isMailConfigUsable,
  sendContactSubmissionEmail,
  sendTestEmail,
};
