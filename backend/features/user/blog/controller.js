const service = require('./service');

async function listPosts(req, res, next) {
  try {
    const data = await service.listPublishedPosts(req.query);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function getPost(req, res, next) {
  try {
    const bundle = await service.getPublishedPostBundleBySlug(req.params.slug);
    if (!bundle || !bundle.post) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found.' } });
    }

    return res.json({ success: true, data: bundle });
  } catch (error) {
    return next(error);
  }
}

async function submitComment(req, res, next) {
  try {
    const result = await service.createPendingComment(req.params.slug, {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });

    if (!result) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found.' } });
    }

    return res.status(201).json({
      success: true,
      data: {
        message: 'Comment submitted and pending moderation.',
        ...result,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPosts,
  getPost,
  submitComment,
};