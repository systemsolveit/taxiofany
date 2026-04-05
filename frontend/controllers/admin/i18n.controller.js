const adminI18nApi = require('../../services/adminI18nApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.adminI18nNotice : null;
  if (req.session) {
    delete req.session.adminI18nNotice;
  }
  return notice;
}

function toTitleCase(value) {
  return String(value || '')
    .split(/[._\-/]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatNamespaceLabel(namespace) {
  if (!namespace) {
    return 'General';
  }

  return toTitleCase(namespace.replace(/^pages\./, ''));
}

function buildEntryGroups(entries = []) {
  const groups = new Map();

  entries.forEach((entry) => {
    const segments = String(entry.key || '').split('.').filter(Boolean);
    const namespace = segments.slice(0, Math.min(segments[0] === 'pages' ? 3 : 2, segments.length)).join('.') || 'general';

    if (!groups.has(namespace)) {
      groups.set(namespace, {
        namespace,
        label: formatNamespaceLabel(namespace),
        count: 0,
        dbCount: 0,
        fallbackCount: 0,
        entries: [],
      });
    }

    const group = groups.get(namespace);
    group.count += 1;
    if (entry.source === 'db') {
      group.dbCount += 1;
    } else {
      group.fallbackCount += 1;
    }
    group.entries.push(entry);
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      entries: group.entries.sort((left, right) => left.key.localeCompare(right.key)),
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

function buildKeywordGroups(keywords = []) {
  const groups = new Map();

  keywords.forEach((item) => {
    const pageId = item.pageId || String(item.file || 'general').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    if (!groups.has(pageId)) {
      groups.set(pageId, {
        pageId,
        pageKey: item.pageKey || 'general',
        pageLabel: item.pageLabel || toTitleCase(item.file || 'General'),
        groupKey: item.groupKey || 'general',
        groupLabel: item.groupLabel || 'General',
        file: item.file,
        count: 0,
        items: [],
      });
    }

    const group = groups.get(pageId);
    group.count += 1;
    group.items.push(item);
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      items: group.items.sort((left, right) => left.suggestedKey.localeCompare(right.suggestedKey)),
    }))
    .sort((left, right) => {
      if (left.groupLabel === right.groupLabel) {
        return left.pageLabel.localeCompare(right.pageLabel);
      }
      return left.groupLabel.localeCompare(right.groupLabel);
    });
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isLikelyUniversalText(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return false;
  }

  if (/^[0-9\s.,:+\-/%$€£]+$/i.test(raw)) {
    return true;
  }

  if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(raw)) {
    return true;
  }

  if (/^(bmw|mercedes|hyundai|taxi|vip|inc|new york|florida|chicago)$/i.test(raw)) {
    return true;
  }

  if (/^[A-Z][A-Za-z0-9 .\-]{1,24}$/.test(raw) && !raw.includes(' ')) {
    return true;
  }

  return false;
}

function buildCoverageGroups(uiPages = [], extractedKeywords = [], entries = [], locale = 'nl') {
  const entryMap = new Map(entries.map((entry) => [entry.key, entry]));
  const groups = new Map();

  uiPages.forEach((page) => {
    const pageId = page.pageId || String(page.file || 'general').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    groups.set(pageId, {
      pageId,
      pageKey: page.pageKey || 'general',
      pageLabel: page.pageLabel || toTitleCase(page.file || 'General'),
      groupKey: page.groupKey || 'general',
      groupLabel: page.groupLabel || 'General',
      file: page.file,
      total: 0,
      translatedCount: 0,
      untranslatedCount: 0,
      missingCount: 0,
      items: [],
    });
  });

  extractedKeywords.forEach((item) => {
    const pageId = item.pageId || String(item.file || 'general').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    if (!groups.has(pageId)) {
      groups.set(pageId, {
        pageId,
        pageKey: item.pageKey || 'general',
        pageLabel: item.pageLabel || toTitleCase(item.file || 'General'),
        groupKey: item.groupKey || 'general',
        groupLabel: item.groupLabel || 'General',
        file: item.file,
        total: 0,
        translatedCount: 0,
        untranslatedCount: 0,
        missingCount: 0,
        items: [],
      });
    }

    const entry = entryMap.get(item.suggestedKey);
    const sourceText = normalizeText(item.text);
    const entryValue = normalizeText(entry && entry.value);
    const hasValue = Boolean(entryValue);

    let status = 'missing';
    if (entry && hasValue) {
      if (locale === 'en' || entryValue !== sourceText) {
        status = 'translated';
      } else if (isLikelyUniversalText(item.text)) {
        status = 'translated';
      } else {
        status = 'untranslated';
      }
    }

    const group = groups.get(pageId);
    group.total += 1;
    if (status === 'translated') {
      group.translatedCount += 1;
    } else if (status === 'untranslated') {
      group.untranslatedCount += 1;
    } else {
      group.missingCount += 1;
    }

    group.items.push({
      ...item,
      currentValue: entry && entry.value ? entry.value : '',
      currentSource: entry && entry.source ? entry.source : 'missing',
      status,
    });
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      completionRate: group.total ? Math.round((group.translatedCount / group.total) * 100) : 0,
      items: group.items.sort((left, right) => left.suggestedKey.localeCompare(right.suggestedKey)),
    }))
    .sort((left, right) => {
      if (left.missingCount !== right.missingCount) {
        return right.missingCount - left.missingCount;
      }
      if (left.untranslatedCount !== right.untranslatedCount) {
        return right.untranslatedCount - left.untranslatedCount;
      }
      return left.pageLabel.localeCompare(right.pageLabel);
    });
}

function buildSummary(entries, extractedKeywords, entryGroups, keywordGroups, coverageGroups) {
  const coverageTotals = coverageGroups.reduce(
    (acc, group) => {
      acc.translated += group.translatedCount;
      acc.untranslated += group.untranslatedCount;
      acc.missing += group.missingCount;
      acc.total += group.total;
      return acc;
    },
    { translated: 0, untranslated: 0, missing: 0, total: 0 }
  );

  return {
    totalEntries: entries.length,
    databaseEntries: entries.filter((entry) => entry.source === 'db').length,
    fallbackEntries: entries.filter((entry) => entry.source !== 'db').length,
    namespaces: entryGroups.length,
    extractedKeywords: extractedKeywords.length,
    pageGroups: coverageGroups.length,
    translatedKeywords: coverageTotals.translated,
    untranslatedKeywords: coverageTotals.untranslated,
    missingKeywords: coverageTotals.missing,
    completionRate: coverageTotals.total ? Math.round((coverageTotals.translated / coverageTotals.total) * 100) : 0,
  };
}

async function page(req, res, next) {
  try {
    const token = req.session && req.session.admin ? req.session.admin.token : null;
    const locale = (req.query.locale || 'nl').toLowerCase();
    const autoTranslate = req.query.autoTranslate !== '0';

    if (!token) {
      return res.redirect('/admin/login');
    }

    const [locales, localeRegistry, uiPages, entriesData, extractedKeywords] = await Promise.all([
      adminI18nApi.listLocales(token),
      adminI18nApi.listLocaleRegistry(token),
      adminI18nApi.listUiPages(token),
      adminI18nApi.listEntries(token, locale),
      adminI18nApi.extractKeywords(token, 5000),
    ]);

    let suggestions = extractedKeywords.map((item) => ({
      ...item,
      translated: locale === 'en' ? item.text : '',
    }));

    if (autoTranslate && locale !== 'en' && extractedKeywords.length) {
      try {
        const translated = await adminI18nApi.translateKeywords(token, {
          texts: extractedKeywords.map((item) => item.text),
          source: 'auto',
          target: locale,
        });

        const map = new Map(translated.map((item) => [item.text, item.translated]));
        suggestions = extractedKeywords.map((item) => ({
          ...item,
          translated: map.get(item.text) || item.text,
        }));
      } catch (error) {
        req.session.adminI18nNotice = {
          type: 'warning',
          message: 'Google translation helper is temporarily unavailable. Showing source text only.',
        };
      }
    }

    const coverageGroups = buildCoverageGroups(uiPages || [], extractedKeywords, entriesData.entries || [], locale);

    const existingDbKeys = new Set(
      (entriesData.entries || [])
        .filter((entry) => entry.source === 'db')
        .map((entry) => entry.key)
    );

    const uniqueSuggestions = [];
    const seenSuggestionKeys = new Set();
    suggestions.forEach((item) => {
      if (!item.suggestedKey || existingDbKeys.has(item.suggestedKey) || seenSuggestionKeys.has(item.suggestedKey)) {
        return;
      }

      seenSuggestionKeys.add(item.suggestedKey);
      uniqueSuggestions.push(item);
    });

    const entryGroups = buildEntryGroups(entriesData.entries || []);
    const keywordGroups = buildKeywordGroups(uniqueSuggestions);
    const inheritedEntriesJson = JSON.stringify(
      (entriesData.entries || [])
        .filter((entry) => entry.source !== 'db')
        .map((entry) => ({ key: entry.key, value: entry.value }))
    );
    const coverageAuditEntriesJson = JSON.stringify(
      coverageGroups
        .flatMap((group) => group.items || [])
        .filter((item) => item.status !== 'translated' && item.suggestedKey)
        .map((item) => ({
          key: item.suggestedKey,
          value: item.currentValue || item.text || '',
        }))
    );

    return res.render('admin/i18n/index', {
      pageTitle: 'Admin i18n',
      activeSection: 'i18n',
      locales,
      localeRegistry,
      selectedLocale: locale,
      entries: entriesData.entries || [],
      entryGroups,
      extractedKeywords: uniqueSuggestions,
      keywordGroups,
      coverageGroups,
      summary: buildSummary(entriesData.entries || [], extractedKeywords, entryGroups, keywordGroups, coverageGroups),
      inheritedEntriesJson,
      coverageAuditEntriesJson,
      autoTranslate,
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
}

async function save(req, res) {
  const token = req.session && req.session.admin ? req.session.admin.token : null;
  const { locale, key, value } = req.body;

  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await adminI18nApi.saveEntry(token, { locale, key, value });
    req.session.adminI18nNotice = {
      type: 'success',
      message: 'Translation saved successfully.',
    };
  } catch (error) {
    req.session.adminI18nNotice = {
      type: 'danger',
      message: error.message || 'Failed to save translation.',
    };
  }

  return res.redirect(`/admin/i18n?locale=${encodeURIComponent(locale || 'nl')}`);
}

async function bulkSave(req, res) {
  const token = req.session && req.session.admin ? req.session.admin.token : null;
  const locale = String(req.body.locale || 'nl').toLowerCase();
  const autoTranslate = req.body.autoTranslate === '0' ? '0' : '1';

  if (!token) {
    return res.redirect('/admin/login');
  }

  let entries = [];
  try {
    entries = JSON.parse(req.body.selectedEntries || '[]');
  } catch (error) {
    entries = [];
  }

  const validEntries = Array.isArray(entries)
    ? entries
        .map((entry) => ({
          key: String(entry && entry.key ? entry.key : '').trim(),
          value: String(entry && Object.prototype.hasOwnProperty.call(entry, 'value') ? entry.value : ''),
          file: String(entry && entry.file ? entry.file : '').trim(),
          text: String(entry && entry.text ? entry.text : '').trim(),
        }))
        .filter((entry) => entry.key)
    : [];

  if (!validEntries.length) {
    req.session.adminI18nNotice = {
      type: 'warning',
      message: 'Select at least one extracted keyword before saving.',
    };
    return res.redirect(`/admin/i18n?locale=${encodeURIComponent(locale)}&autoTranslate=${encodeURIComponent(autoTranslate)}`);
  }

  try {
    const result = await adminI18nApi.bulkSaveEntries(token, { locale, entries: validEntries });
    const updatedFiles = result && result.templateUpdates ? Number(result.templateUpdates.filesUpdated || 0) : 0;
    const replacements = result && result.templateUpdates ? Number(result.templateUpdates.replacements || 0) : 0;
    const failureCount = result && result.templateUpdates && Array.isArray(result.templateUpdates.failures)
      ? result.templateUpdates.failures.length
      : 0;
    const templateMessage = updatedFiles > 0
      ? ` Template sync updated ${updatedFiles} ${updatedFiles === 1 ? 'file' : 'files'} (${replacements} replacement${replacements === 1 ? '' : 's'}).`
      : ' Template sync made no file changes.';
    const failureMessage = failureCount > 0
      ? ` ${failureCount} template update ${failureCount === 1 ? 'error' : 'errors'} occurred.`
      : '';

    req.session.adminI18nNotice = {
      type: 'success',
      message: `${result.count} translation ${result.count === 1 ? 'entry' : 'entries'} saved successfully.${templateMessage}${failureMessage}`,
    };
  } catch (error) {
    req.session.adminI18nNotice = {
      type: 'danger',
      message: error.message || 'Failed to save selected translations.',
    };
  }

  return res.redirect(`/admin/i18n?locale=${encodeURIComponent(locale)}&autoTranslate=${encodeURIComponent(autoTranslate)}`);
}

async function createLocale(req, res) {
  const token = req.session && req.session.admin ? req.session.admin.token : null;
  const selectedLocale = String(req.body.selectedLocale || req.body.baseLocale || 'nl').toLowerCase();
  const autoTranslate = req.body.autoTranslate === '0' ? '0' : '1';

  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const result = await adminI18nApi.createLocale(token, {
      code: req.body.code,
      label: req.body.label,
      baseLocale: req.body.baseLocale,
      isActive: req.body.isActive !== 'false',
    });
    req.session.adminI18nNotice = {
      type: 'success',
      message: `Locale ${result.code} created successfully.`,
    };
  } catch (error) {
    req.session.adminI18nNotice = {
      type: 'danger',
      message: error.message || 'Failed to create locale.',
    };
  }

  return res.redirect(`/admin/i18n?locale=${encodeURIComponent(selectedLocale)}&autoTranslate=${encodeURIComponent(autoTranslate)}`);
}

async function updateLocale(req, res) {
  const token = req.session && req.session.admin ? req.session.admin.token : null;
  const selectedLocale = String(req.body.selectedLocale || req.params.code || 'nl').toLowerCase();
  const autoTranslate = req.body.autoTranslate === '0' ? '0' : '1';

  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const result = await adminI18nApi.updateLocale(token, req.params.code, {
      label: req.body.label,
      baseLocale: req.body.baseLocale,
      isActive: req.body.isActive === 'true',
    });
    req.session.adminI18nNotice = {
      type: 'success',
      message: `Locale ${result.code} updated successfully.`,
    };
  } catch (error) {
    req.session.adminI18nNotice = {
      type: 'danger',
      message: error.message || 'Failed to update locale.',
    };
  }

  return res.redirect(`/admin/i18n?locale=${encodeURIComponent(selectedLocale)}&autoTranslate=${encodeURIComponent(autoTranslate)}`);
}

async function translateKeywordsJson(req, res) {
  const token = req.session && req.session.admin ? req.session.admin.token : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Admin session expired. Please log in again.' },
    });
  }

  try {
    const data = await adminI18nApi.translateKeywords(token, {
      texts: Array.isArray(req.body.texts) ? req.body.texts : [],
      source: req.body.source || 'auto',
      target: req.body.target || 'nl',
    });
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: { message: error.message || 'Translate request failed.' },
    });
  }
}

async function bulkSaveJson(req, res) {
  const token = req.session && req.session.admin ? req.session.admin.token : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Admin session expired. Please log in again.' },
    });
  }

  try {
    const data = await adminI18nApi.bulkSaveEntries(token, {
      locale: req.body.locale,
      entries: Array.isArray(req.body.entries) ? req.body.entries : [],
    });
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: { message: error.message || 'Bulk save failed.' },
    });
  }
}

async function populateLocaleJson(req, res) {
  const token = req.session && req.session.admin ? req.session.admin.token : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Admin session expired. Please log in again.' },
    });
  }

  try {
    const data = await adminI18nApi.populateLocale(token, req.params.code);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: { message: error.message || 'Populate locale failed.' },
    });
  }
}

module.exports = {
  page,
  save,
  bulkSave,
  createLocale,
  updateLocale,
  translateKeywordsJson,
  bulkSaveJson,
  populateLocaleJson,
};
