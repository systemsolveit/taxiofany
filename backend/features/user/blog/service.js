const { BlogPost } = require('../../../models');

async function listPublishedPosts(query = {}) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);
  const filter = { isPublished: true };

  if (query.category) {
    filter.category = String(query.category).trim();
  }

  if (query.q) {
    const q = String(query.q).trim();
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { excerpt: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

async function getPublishedPostBySlug(slug) {
  return BlogPost.findOne({ slug: String(slug || '').trim().toLowerCase(), isPublished: true }).lean();
}

async function getPublishedPostBundleBySlug(slug) {
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    return null;
  }

  const [previousPost, nextPost] = await Promise.all([
    BlogPost.findOne({
      isPublished: true,
      publishedAt: { $lt: post.publishedAt },
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean(),
    BlogPost.findOne({
      isPublished: true,
      publishedAt: { $gt: post.publishedAt },
    })
      .sort({ publishedAt: 1, createdAt: 1 })
      .lean(),
  ]);

  return {
    post,
    previousPost: previousPost || null,
    nextPost: nextPost || null,
  };
}

function normalizeCommentPayload(payload = {}) {
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const message = String(payload.message || '').trim();

  return {
    name,
    email,
    message,
  };
}

function buildDateLabel(date = new Date()) {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

async function createPendingComment(slug, payload = {}) {
  const post = await BlogPost.findOne({
    slug: String(slug || '').trim().toLowerCase(),
    isPublished: true,
  });

  if (!post) {
    return null;
  }

  const normalized = normalizeCommentPayload(payload);

  const comment = {
    name: normalized.name,
    email: normalized.email,
    message: normalized.message,
    dateLabel: buildDateLabel(),
    avatar: '',
    approved: false,
    replies: [],
  };

  post.comments.push(comment);
  await post.save();

  const savedComment = post.comments[post.comments.length - 1];
  return {
    postId: String(post._id),
    commentId: savedComment ? String(savedComment._id) : null,
    approved: false,
  };
}

module.exports = {
  listPublishedPosts,
  getPublishedPostBySlug,
  getPublishedPostBundleBySlug,
  createPendingComment,
};