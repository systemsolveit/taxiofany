const blogApi = require('./blogApi');
const { asArray, warnDev } = require('./apiListUtils');

/**
 * Newest-first by createdAt (Mongo ObjectId time is a weak fallback when createdAt is missing).
 */
function sortByLatestCreated(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return [...items].sort((a, b) => {
    const ta = new Date(a && a.createdAt ? a.createdAt : 0).getTime();
    const tb = new Date(b && b.createdAt ? b.createdAt : 0).getTime();
    if (tb !== ta) {
      return tb - ta;
    }
    return String(b && b._id ? b._id : '').localeCompare(String(a && a._id ? a._id : ''));
  });
}

/**
 * Published posts for home: fetch a page large enough to re-rank by createdAt, then show the N newest.
 */
async function listPublishedBlogPostsForHome(limit = 3) {
  const n = Math.min(Math.max(Number(limit) || 3, 1), 12);
  try {
    const data = await blogApi.listPosts({ page: 1, limit: 50 });
    const items = asArray(data);
    return sortByLatestCreated(items).slice(0, n);
  } catch (error) {
    warnDev('publicBlog', error);
    return [];
  }
}

module.exports = {
  sortByLatestCreated,
  listPublishedBlogPostsForHome,
};
