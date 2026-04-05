const { BlogPost } = require('../../../models');

function parseTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJsonArray(value, fallback = []) {
  if (Array.isArray(value)) {
    return value;
  }

  const text = String(value || '').trim();
  if (!text) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

function normalizeSocialLinks(value) {
  return parseJsonArray(value, [])
    .map((item) => ({
      icon: String(item && item.icon ? item.icon : 'lab la-facebook-f').trim() || 'lab la-facebook-f',
      url: String(item && item.url ? item.url : '#').trim() || '#',
    }))
    .filter((item) => item.icon || item.url);
}

function normalizeComments(value) {
  return parseJsonArray(value, [])
    .map((item) => {
      const approved = item && item.approved !== undefined ? Boolean(item.approved) : true;
      const approvedAt = approved
        ? (item && item.approvedAt ? new Date(item.approvedAt) : new Date())
        : null;

      return {
        name: String(item && item.name ? item.name : '').trim(),
        email: String(item && item.email ? item.email : '').trim(),
        dateLabel: String(item && item.dateLabel ? item.dateLabel : '').trim(),
        avatar: String(item && item.avatar ? item.avatar : '').trim(),
        message: String(item && item.message ? item.message : '').trim(),
        approved,
        approvedAt,
        approvedBy: approved ? String(item && item.approvedBy ? item.approvedBy : '').trim() : '',
        replies: parseJsonArray(item && item.replies ? item.replies : [], []).map((reply) => {
          const replyApproved = reply && reply.approved !== undefined ? Boolean(reply.approved) : true;
          const replyApprovedAt = replyApproved
            ? (reply && reply.approvedAt ? new Date(reply.approvedAt) : new Date())
            : null;

          return {
            name: String(reply && reply.name ? reply.name : '').trim(),
            email: String(reply && reply.email ? reply.email : '').trim(),
            dateLabel: String(reply && reply.dateLabel ? reply.dateLabel : '').trim(),
            avatar: String(reply && reply.avatar ? reply.avatar : '').trim(),
            message: String(reply && reply.message ? reply.message : '').trim(),
            approved: replyApproved,
            approvedAt: replyApprovedAt,
            approvedBy: replyApproved ? String(reply && reply.approvedBy ? reply.approvedBy : '').trim() : '',
          };
        }),
      };
    })
    .filter((item) => item.name || item.message);
}

async function listPosts() {
  return BlogPost.find({}).sort({ createdAt: -1 }).lean();
}

async function getPostById(id) {
  return BlogPost.findById(id).lean();
}

async function createPost(payload = {}) {
  const doc = await BlogPost.create({
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    contentSecondary: payload.contentSecondary,
    quoteText: payload.quoteText,
    quoteAuthor: payload.quoteAuthor,
    contentTertiary: payload.contentTertiary,
    sectionHeading: payload.sectionHeading,
    sectionParagraphOne: payload.sectionParagraphOne,
    sectionParagraphTwo: payload.sectionParagraphTwo,
    galleryImages: parseStringList(payload.galleryImages),
    category: payload.category,
    authorName: payload.authorName,
    coverImage: payload.coverImage,
    authorAvatar: payload.authorAvatar,
    authorBio: payload.authorBio,
    authorSocialLinks: normalizeSocialLinks(payload.authorSocialLinks),
    comments: normalizeComments(payload.comments),
    tags: parseTags(payload.tags),
    isPublished: payload.isPublished !== false,
    publishedAt: payload.publishedAt || new Date(),
  });

  return doc.toObject();
}

async function updatePost(id, payload = {}) {
  const update = {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    contentSecondary: payload.contentSecondary,
    quoteText: payload.quoteText,
    quoteAuthor: payload.quoteAuthor,
    contentTertiary: payload.contentTertiary,
    sectionHeading: payload.sectionHeading,
    sectionParagraphOne: payload.sectionParagraphOne,
    sectionParagraphTwo: payload.sectionParagraphTwo,
    galleryImages: parseStringList(payload.galleryImages),
    category: payload.category,
    authorName: payload.authorName,
    coverImage: payload.coverImage,
    authorAvatar: payload.authorAvatar,
    authorBio: payload.authorBio,
    authorSocialLinks: normalizeSocialLinks(payload.authorSocialLinks),
    comments: normalizeComments(payload.comments),
    tags: parseTags(payload.tags),
    isPublished: payload.isPublished,
    publishedAt: payload.publishedAt,
  };

  Object.keys(update).forEach((key) => {
    if (update[key] === undefined) {
      delete update[key];
    }
  });

  return BlogPost.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
}

async function deletePost(id) {
  return BlogPost.findByIdAndDelete(id).lean();
}

module.exports = {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};