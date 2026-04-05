const emailsApi = require('../../services/emailsApi');

async function listTemplatesSafely() {
  try {
    const items = await emailsApi.listTemplates();
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

exports.listPage = async (req, res) => {
  const templates = await listTemplatesSafely();
  return res.render('users/emails/list', {
    templates,
  });
};

exports.detailsPage = async (req, res) => {
  const templates = await listTemplatesSafely();
  let template = null;

  try {
    template = await emailsApi.getTemplateBySlug(req.params.slug);
  } catch (error) {
    template = null;
  }

  if (!template && templates.length) {
    template = templates[0];
  }

  return res.render('users/emails/details', {
    template,
    templates,
    requestedSlug: req.params.slug,
  });
};
