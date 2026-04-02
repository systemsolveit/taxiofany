const adminI18nApi = require('../../services/adminI18nApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.adminI18nNotice : null;
  if (req.session) {
    delete req.session.adminI18nNotice;
  }
  return notice;
}

async function page(req, res, next) {
  try {
    const token = req.session && req.session.admin ? req.session.admin.token : null;
    const locale = (req.query.locale || 'nl').toLowerCase();
    const autoTranslate = req.query.autoTranslate !== '0';

    if (!token) {
      return res.redirect('/admin/login');
    }

    const [locales, entriesData, extractedKeywords] = await Promise.all([
      adminI18nApi.listLocales(token),
      adminI18nApi.listEntries(token, locale),
      adminI18nApi.extractKeywords(token, 120),
    ]);

    let suggestions = extractedKeywords.map((item) => ({
      ...item,
      translated: locale === 'en' ? item.text : '',
    }));

    if (autoTranslate && locale !== 'en' && extractedKeywords.length) {
      try {
        const translated = await adminI18nApi.translateKeywords(token, {
          texts: extractedKeywords.map((item) => item.text),
          source: 'en',
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

    return res.render('admin/i18n/index', {
      pageTitle: 'Admin i18n',
      activeSection: 'i18n',
      locales,
      selectedLocale: locale,
      entries: entriesData.entries || [],
      extractedKeywords: suggestions,
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

module.exports = {
  page,
  save,
};
