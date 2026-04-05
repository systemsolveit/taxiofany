const service = require('./service');

async function listPosts(req, res, next) {
  try {
    const posts = await service.listPosts();
    return res.json({ success: true, data: posts });
  } catch (error) {
    return next(error);
  }
}

async function getPost(req, res, next) {
  try {
    const post = await service.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found.' } });
    }
    return res.json({ success: true, data: post });
  } catch (error) {
    return next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const post = await service.createPost(req.body);
    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    return next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const post = await service.updatePost(req.params.id, req.body);
    if (!post) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found.' } });
    }
    return res.json({ success: true, data: post });
  } catch (error) {
    return next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const post = await service.deletePost(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found.' } });
    }
    return res.json({ success: true, data: post });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};