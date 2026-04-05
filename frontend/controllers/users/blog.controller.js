const blogApi = require('../../services/blogApi');

async function fetchPostsSafely(params = {}) {
  try {
    const result = await blogApi.listPosts(params);
    return {
      items: Array.isArray(result.items) ? result.items : [],
      pagination: result && result.pagination ? result.pagination : null,
    };
  } catch (error) {
    return {
      items: [],
      pagination: null,
    };
  }
}

function buildSidebarData(posts = []) {
  const categoryMap = new Map();
  const tagMap = new Map();

  posts.forEach((post) => {
    const category = String(post && post.category ? post.category : 'General').trim() || 'General';
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);

    const tags = Array.isArray(post && post.tags ? post.tags : []) ? post.tags : [];
    tags.forEach((tag) => {
      const cleanTag = String(tag || '').trim();
      if (!cleanTag) {
        return;
      }
      tagMap.set(cleanTag, (tagMap.get(cleanTag) || 0) + 1);
    });
  });

  const categories = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 8);

  const popularTags = Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 12);

  const recentArticles = [...posts]
    .sort((left, right) => {
      const leftDate = new Date(left && left.publishedAt ? left.publishedAt : 0).getTime();
      const rightDate = new Date(right && right.publishedAt ? right.publishedAt : 0).getTime();
      return rightDate - leftDate;
    })
    .slice(0, 3);

  return {
    categories,
    recentArticles,
    popularTags,
  };
}

exports.gridPage = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const q = String(req.query.q || '').trim();
  const category = String(req.query.category || '').trim();

  const [listing, sidebarSource] = await Promise.all([
    fetchPostsSafely({ page, limit: 12, q, category }),
    fetchPostsSafely({ page: 1, limit: 100 }),
  ]);

  res.render('users/blog/grid', {
    blogPosts: listing.items,
    blogSidebar: buildSidebarData(sidebarSource.items),
    blogPagination: listing.pagination,
    blogFilters: { q, category },
  });
};

exports.classicPage = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const q = String(req.query.q || '').trim();
  const category = String(req.query.category || '').trim();

  const [listing, sidebarSource] = await Promise.all([
    fetchPostsSafely({ page, limit: 10, q, category }),
    fetchPostsSafely({ page: 1, limit: 100 }),
  ]);

  res.render('users/blog/classic', {
    blogPosts: listing.items,
    blogSidebar: buildSidebarData(sidebarSource.items),
    blogPagination: listing.pagination,
    blogFilters: { q, category },
  });
};

exports.detailsPage = async (req, res) => {
  const slug = req.params.slug || req.query.post;
  const locale = String(res.locals.locale || 'nl').toLowerCase();
  const commentStatus = String(req.query.commentStatus || '').trim().toLowerCase();
  let blogPost = null;
  let previousPost = null;
  let nextPost = null;

  if (slug) {
    try {
      const payload = await blogApi.getPostBySlug(slug);
      if (payload && payload.post) {
        blogPost = payload.post;
        previousPost = payload.previousPost || null;
        nextPost = payload.nextPost || null;
      } else {
        blogPost = payload;
      }
    } catch (error) {
      blogPost = null;
    }
  }

  if (!blogPost) {
    const posts = await fetchPostsSafely({ page: 1, limit: 1 });
    blogPost = posts.items.length ? posts.items[0] : null;
  }

  const effectiveSlug = blogPost && blogPost.slug ? blogPost.slug : slug;
  const commentAction = effectiveSlug
    ? `/${locale}/blog/details/${encodeURIComponent(effectiveSlug)}/comment`
    : '#';

  res.render('users/blog/details', {
    blogPost,
    previousPost,
    nextPost,
    commentAction,
    commentStatus,
  });
};

exports.submitComment = async (req, res) => {
  const slug = String(req.params.slug || '').trim();
  const locale = String(res.locals.locale || 'nl').toLowerCase();
  const redirectBase = `/${locale}/blog/details/${encodeURIComponent(slug)}`;

  if (!slug) {
    return res.redirect(`/${locale}/blog?commentStatus=error`);
  }

  const payload = {
    name: String(req.body.name || '').trim(),
    email: String(req.body.email || '').trim(),
    message: String(req.body.comment || '').trim(),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return res.redirect(`${redirectBase}?commentStatus=validation`);
  }

  try {
    await blogApi.submitComment(slug, payload);
    return res.redirect(`${redirectBase}?commentStatus=submitted`);
  } catch (error) {
    return res.redirect(`${redirectBase}?commentStatus=error`);
  }
};
