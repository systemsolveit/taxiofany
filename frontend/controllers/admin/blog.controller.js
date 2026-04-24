const blogApi = require('../../services/adminBlogApi');
const mediaHubApi = require('../../services/adminMediaHubApi');
const i18nApi = require('../../services/adminI18nApi');

function splitKeywords(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toTitleCase(value) {
  return String(value || '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .trim();
}

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function pickLocaleEntryValue(entry) {
  if (!entry) {
    return '';
  }
  return normalizeText(entry.value || entry.text || '');
}

function buildMediaPreviewUrl(filename) {
  return `/admin/mediahub/assets/${encodeURIComponent(filename)}`;
}

function mapMediaItem(item = {}) {
  return {
    filename: item.filename,
    title: item.title || item.originalname || item.filename || 'Untitled',
    altText: item.altText || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    kind: item.kind || 'file',
    previewUrl: buildMediaPreviewUrl(item.filename),
    size: item.size || 0,
  };
}

function buildKeywordRegex(keywords) {
  if (!Array.isArray(keywords) || !keywords.length) {
    return null;
  }

  const escaped = keywords
    .map((keyword) => String(keyword || '').trim())
    .filter(Boolean)
    .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (!escaped.length) {
    return null;
  }

  return new RegExp(`(${escaped.join('|')})`, 'i');
}

function pickLocaleSnippets(entries = [], keywords = []) {
  const keywordRegex = buildKeywordRegex(keywords);
  const snippets = [];

  const fallbackPool = entries
    .filter((entry) => String(entry.key || '').startsWith('pages.users.blog.'))
    .slice(0, 40);

  const source = keywordRegex
    ? entries.filter((entry) => {
        const key = normalizeText(entry.key || '');
        const value = pickLocaleEntryValue(entry);
        return keywordRegex.test(key) || keywordRegex.test(value);
      })
    : [];

  [...source, ...fallbackPool].forEach((entry) => {
    const value = pickLocaleEntryValue(entry);
    if (!value || snippets.includes(value)) {
      return;
    }
    snippets.push(value);
  });

  return snippets.slice(0, 6);
}

function applyToneToDraft(draft, tone, locale) {
  const safeTone = String(tone || 'helpful').trim().toLowerCase();
  const localeCode = String(locale || 'nl').trim().toLowerCase();
  const suffixByTone = {
    formal: localeCode === 'nl'
      ? 'Deze tekst hanteert een formele, professionele toon met duidelijke structuur.'
      : 'This draft uses a formal and professional tone with clear structure.',
    marketing: localeCode === 'nl'
      ? 'Focus op waardepropositie, conversie en duidelijke call-to-action.'
      : 'Focuses on value proposition, conversion, and a clear call to action.',
    helpful: localeCode === 'nl'
      ? 'Praktische tips en heldere uitleg staan centraal in deze versie.'
      : 'Practical tips and clear explanations are emphasized in this version.',
  };

  const titlePrefix = {
    formal: localeCode === 'nl' ? 'Professionele gids:' : 'Professional guide:',
    marketing: localeCode === 'nl' ? 'Topkeuze:' : 'Top choice:',
    helpful: localeCode === 'nl' ? 'Praktische gids:' : 'Practical guide:',
  };

  const chosenTone = suffixByTone[safeTone] ? safeTone : 'helpful';
  const toneNote = suffixByTone[chosenTone];

  return {
    ...draft,
    title: `${titlePrefix[chosenTone]} ${draft.title}`.slice(0, 110),
    excerpt: `${draft.excerpt} ${toneNote}`.slice(0, 220),
    content: `${draft.content}\n\n${toneNote}`,
    tone: chosenTone,
  };
}

function uniqueText(values = []) {
  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    const normalized = normalizeText(value);
    if (!normalized) {
      return;
    }
    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    result.push(normalized);
  });
  return result;
}

function keywordTokensFromEntry(entry) {
  const out = [];
  const value = pickLocaleEntryValue(entry);
  if (value) {
    out.push(value);
  }
  const key = normalizeText(entry && entry.key ? entry.key : '');
  if (key) {
    key
      .split(/[._-]+/)
      .map((part) => part.trim())
      .filter((part) => part.length >= 4)
      .forEach((part) => out.push(part));
  }
  return out;
}

function scoreByQuery(value, query) {
  const text = String(value || '').toLowerCase();
  if (!query) {
    return 1;
  }
  if (text === query) {
    return 5;
  }
  if (text.startsWith(query)) {
    return 4;
  }
  if (text.includes(query)) {
    return 2;
  }
  return 0;
}

async function suggestKeywords(token, locale, query, limit = 10) {
  const suggestions = [];

  try {
    const localeData = await i18nApi.listEntries(token, locale);
    const entries = Array.isArray(localeData.entries) ? localeData.entries : [];
    entries.forEach((entry) => {
      keywordTokensFromEntry(entry).forEach((tokenValue) => {
        suggestions.push({ source: 'locale', value: tokenValue });
      });
    });
  } catch (error) {
    // Continue with extracted suggestions.
  }

  try {
    const extracted = await i18nApi.extractKeywords(token, 160);
    if (Array.isArray(extracted)) {
      extracted.forEach((item) => {
        suggestions.push({ source: 'extract', value: item.text || '' });
      });
    }
  } catch (error) {
    // Keep locale-derived suggestions if extraction fails.
  }

  const deduped = uniqueText(suggestions.map((item) => item.value));
  const queryKey = String(query || '').trim().toLowerCase();

  return deduped
    .map((value) => ({ value, score: scoreByQuery(value, queryKey) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || left.value.length - right.value.length)
    .slice(0, limit)
    .map((item) => item.value);
}

function buildDraftFromLocale({ locale, keywords, snippets, tone }) {
  const cleanLocale = String(locale || 'nl').trim().toLowerCase();
  const baseKeyword = keywords[0] || 'taxi service';
  const secondaryKeyword = keywords[1] || 'city rides';

  const title = snippets[0]
    ? snippets[0].slice(0, 90)
    : `${toTitleCase(baseKeyword)} guide for ${cleanLocale.toUpperCase()}`;

  const excerpt = snippets[1]
    ? snippets[1].slice(0, 180)
    : `Actionable insights about ${baseKeyword} and ${secondaryKeyword} prepared for ${cleanLocale.toUpperCase()} readers.`;

  const paragraphOne = snippets[2]
    ? snippets[2]
    : `${toTitleCase(baseKeyword)} is changing how passengers plan daily transportation and business mobility.`;

  const paragraphTwo = snippets[3]
    ? snippets[3]
    : `In this article, we focus on ${secondaryKeyword}, service quality, transparent pricing, and rider trust.`;

  const paragraphThree = snippets[4]
    ? snippets[4]
    : `Use this post as a localized content baseline, then refine examples and calls-to-action for your audience.`;

  const draft = {
    title,
    slug: toSlug(title || baseKeyword),
    excerpt,
    content: `${paragraphOne}\n\n${paragraphTwo}\n\n${paragraphThree}`,
    category: toTitleCase(baseKeyword),
    tags: keywords.slice(0, 6).join(', '),
  };

  return applyToneToDraft(draft, tone, cleanLocale);
}

async function listLocaleOptions(token) {
  try {
    const locales = await i18nApi.listLocaleRegistry(token);
    if (Array.isArray(locales) && locales.length) {
      return locales
        .filter((item) => item && item.isEnabled !== false)
        .map((item) => ({
          code: item.code,
          label: item.label || item.code,
        }));
    }
  } catch (error) {
    // Fallback below.
  }

  try {
    const fallback = await i18nApi.listLocales(token);
    if (Array.isArray(fallback)) {
      return fallback.map((code) => ({ code, label: code }));
    }
  } catch (error) {
    return [{ code: 'nl', label: 'Dutch' }, { code: 'en', label: 'English' }];
  }

  return [{ code: 'nl', label: 'Dutch' }, { code: 'en', label: 'English' }];
}

async function listMediaChoices(token, query = '', page = 1, pageSize = 24) {
  try {
    const result = await mediaHubApi.listMedia(token, {
      q: query || '',
      type: 'image',
      page,
      pageSize,
    });
    const items = Array.isArray(result.items) ? result.items : [];
    return {
      items: items.map(mapMediaItem),
      pagination: result.pagination || {
        page,
        pageSize,
        hasMore: false,
        totalItems: items.length,
      },
    };
  } catch (error) {
    return {
      items: [],
      pagination: {
        page,
        pageSize,
        hasMore: false,
        totalItems: 0,
      },
    };
  }
}

function consumeNotice(req) {
  const notice = req.session ? req.session.blogNotice : null;
  if (req.session) {
    delete req.session.blogNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.blogNotice = { type, message };
  }
}

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

function getAdminEmail(req) {
  const email = req.session
    && req.session.admin
    && req.session.admin.user
    && req.session.admin.user.email
    ? req.session.admin.user.email
    : '';
  return String(email || '').trim().toLowerCase();
}

function parseJsonArraySafe(value) {
  if (Array.isArray(value)) {
    return value;
  }

  const text = String(value || '').trim();
  if (!text) {
    return [];
  }

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function normalizeCommentsForAudit(rawComments, actorEmail, options = {}) {
  const nowIso = new Date().toISOString();
  const forceApprovePending = !!options.forceApprovePending;
  const clearPending = !!options.clearPending;

  return parseJsonArraySafe(rawComments)
    .map((comment) => {
      const approved = forceApprovePending
        ? true
        : (comment && comment.approved !== undefined ? !!comment.approved : true);

      let replies = parseJsonArraySafe(comment && comment.replies ? comment.replies : [])
        .map((reply) => {
          const replyApproved = forceApprovePending
            ? true
            : (reply && reply.approved !== undefined ? !!reply.approved : true);

          return {
            name: String(reply && reply.name ? reply.name : '').trim(),
            email: String(reply && reply.email ? reply.email : '').trim(),
            dateLabel: String(reply && reply.dateLabel ? reply.dateLabel : '').trim(),
            avatar: String(reply && reply.avatar ? reply.avatar : '').trim(),
            message: String(reply && reply.message ? reply.message : '').trim(),
            approved: replyApproved,
            approvedAt: replyApproved ? (reply && reply.approvedAt ? reply.approvedAt : nowIso) : null,
            approvedBy: replyApproved ? String(reply && reply.approvedBy ? reply.approvedBy : actorEmail) : '',
          };
        })
        .filter((reply) => reply.name || reply.message);

      if (clearPending) {
        replies = replies.filter((reply) => reply.approved !== false);
      }

      return {
        name: String(comment && comment.name ? comment.name : '').trim(),
        email: String(comment && comment.email ? comment.email : '').trim(),
        dateLabel: String(comment && comment.dateLabel ? comment.dateLabel : '').trim(),
        avatar: String(comment && comment.avatar ? comment.avatar : '').trim(),
        message: String(comment && comment.message ? comment.message : '').trim(),
        approved,
        approvedAt: approved ? (comment && comment.approvedAt ? comment.approvedAt : nowIso) : null,
        approvedBy: approved ? String(comment && comment.approvedBy ? comment.approvedBy : actorEmail) : '',
        replies,
      };
    })
    .filter((comment) => comment.name || comment.message)
    .filter((comment) => !(clearPending && comment.approved === false));
}

function computeModerationStats(post) {
  const comments = Array.isArray(post && post.comments) ? post.comments : [];
  let pendingComments = 0;
  let approvedComments = 0;
  let pendingReplies = 0;
  let approvedReplies = 0;

  comments.forEach((comment) => {
    if (comment && comment.approved === false) {
      pendingComments += 1;
    } else {
      approvedComments += 1;
    }

    const replies = Array.isArray(comment && comment.replies) ? comment.replies : [];
    replies.forEach((reply) => {
      if (reply && reply.approved === false) {
        pendingReplies += 1;
      } else {
        approvedReplies += 1;
      }
    });
  });

  return {
    pendingComments,
    approvedComments,
    pendingReplies,
    approvedReplies,
    pendingTotal: pendingComments + pendingReplies,
    approvedTotal: approvedComments + approvedReplies,
  };
}

function mapPostPayload(body = {}, actorEmail = '') {
  return {
    title: String(body.title || '').trim(),
    slug: String(body.slug || '').trim(),
    excerpt: String(body.excerpt || '').trim(),
    content: String(body.content || '').trim(),
    contentSecondary: String(body.contentSecondary || '').trim(),
    quoteText: String(body.quoteText || '').trim(),
    quoteAuthor: String(body.quoteAuthor || '').trim(),
    contentTertiary: String(body.contentTertiary || '').trim(),
    sectionHeading: String(body.sectionHeading || '').trim(),
    sectionParagraphOne: String(body.sectionParagraphOne || '').trim(),
    sectionParagraphTwo: String(body.sectionParagraphTwo || '').trim(),
    galleryImages: String(body.galleryImages || '').trim(),
    category: String(body.category || '').trim(),
    authorName: String(body.authorName || '').trim(),
    coverImage: String(body.coverImage || '').trim(),
    authorAvatar: String(body.authorAvatar || '').trim(),
    authorBio: String(body.authorBio || '').trim(),
    authorSocialLinks: String(body.authorSocialLinks || '').trim(),
    comments: normalizeCommentsForAudit(body.comments, actorEmail),
    tags: String(body.tags || '').trim(),
    isPublished: body.isPublished === 'true' || body.isPublished === 'on',
    publishedAt: body.publishedAt ? new Date(body.publishedAt).toISOString() : undefined,
  };
}

function formatDateTimeLocal(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

exports.listPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const commentState = String(req.query.commentState || 'all').trim().toLowerCase();
    const posts = await blogApi.listPosts(token);
    const withStats = posts.map((post) => {
      const moderation = computeModerationStats(post);
      return { ...post, moderation };
    });

    const filteredPosts = withStats.filter((post) => {
      if (commentState === 'pending') {
        return post.moderation.pendingTotal > 0;
      }
      if (commentState === 'approved') {
        return post.moderation.pendingTotal === 0 && post.moderation.approvedTotal > 0;
      }
      return true;
    });

    const moderationTotals = withStats.reduce((acc, post) => {
      acc.pending += post.moderation.pendingTotal;
      acc.approved += post.moderation.approvedTotal;
      return acc;
    }, { pending: 0, approved: 0 });

    return res.render('admin/blog/list', {
      pageTitle: 'Blog Management',
      activeSection: 'blog',
      posts: filteredPosts,
      commentState,
      moderationTotals,
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
};

exports.newPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const [localeOptions, mediaResult] = await Promise.all([
      listLocaleOptions(token),
      listMediaChoices(token),
    ]);

    return res.render('admin/blog/form', {
      pageTitle: 'Create Blog Post',
      activeSection: 'blog',
      mode: 'create',
      post: {
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        contentSecondary: '',
        quoteText: '',
        quoteAuthor: '',
        contentTertiary: '',
        sectionHeading: '',
        sectionParagraphOne: '',
        sectionParagraphTwo: '',
        galleryImages: [],
        category: 'General',
        authorName: 'Admin',
        coverImage: '/assets/img/post-1.jpg',
        authorAvatar: '/assets/img/auhtor.png',
        authorBio: '',
        authorSocialLinks: [],
        comments: [],
        tags: [],
        isPublished: false,
        publishedAt: new Date().toISOString(),
      },
      publishedAtValue: formatDateTimeLocal(new Date()),
      notice: consumeNotice(req),
      localeOptions,
      selectedLocale: req.query.locale || 'nl',
      selectedTone: req.query.tone || 'helpful',
      mediaLibrary: mediaResult.items,
      mediaPagination: mediaResult.pagination,
      initialMediaQuery: '',
    });
  } catch (error) {
    return next(error);
  }
};

exports.editPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const [post, localeOptions, mediaResult] = await Promise.all([
      blogApi.getPost(token, req.params.id),
      listLocaleOptions(token),
      listMediaChoices(token),
    ]);

    return res.render('admin/blog/form', {
      pageTitle: 'Edit Blog Post',
      activeSection: 'blog',
      mode: 'edit',
      post,
      publishedAtValue: formatDateTimeLocal(post.publishedAt),
      notice: consumeNotice(req),
      localeOptions,
      selectedLocale: req.query.locale || 'nl',
      selectedTone: req.query.tone || 'helpful',
      mediaLibrary: mediaResult.items,
      mediaPagination: mediaResult.pagination,
      initialMediaQuery: '',
    });
  } catch (error) {
    return next(error);
  }
};

exports.searchMedia = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  }

  const q = normalizeText(req.query.q || '');
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(48, Math.max(6, Number(req.query.pageSize) || 24));
  const result = await listMediaChoices(token, q, page, pageSize);
  return res.json({
    success: true,
    data: {
      items: result.items,
      pagination: result.pagination,
    },
  });
};

exports.keywordSuggestions = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  }

  const locale = String(req.query.locale || 'nl').trim().toLowerCase();
  const q = normalizeText(req.query.q || '');
  const limit = Math.min(20, Math.max(5, Number(req.query.limit) || 12));

  try {
    const suggestions = await suggestKeywords(token, locale, q, limit);
    return res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: error.message || 'Unable to fetch keyword suggestions.' },
    });
  }
};

exports.generateDraft = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  }

  const locale = String(req.body.locale || 'nl').trim().toLowerCase();
  const tone = String(req.body.tone || 'helpful').trim().toLowerCase();
  const keywords = splitKeywords(req.body.keywords).slice(0, 8);
  const mediaQuery = normalizeText(req.body.mediaQuery || keywords[0] || '');

  if (!keywords.length) {
    return res.status(400).json({
      success: false,
      error: { message: 'Please provide at least one keyword.' },
    });
  }

  try {
    const [entryData, mediaResult] = await Promise.all([
      i18nApi.listEntries(token, locale),
      listMediaChoices(token, mediaQuery),
    ]);

    const entries = Array.isArray(entryData.entries) ? entryData.entries : [];
    const snippets = pickLocaleSnippets(entries, keywords);

    const draft = buildDraftFromLocale({
      locale,
      keywords,
      snippets,
      tone,
    });

    const suggestions = await suggestKeywords(token, locale, keywords[0] || '', 12);

    return res.json({
      success: true,
      data: {
        ...draft,
        locale,
        mediaLibrary: mediaResult.items,
        mediaPagination: mediaResult.pagination,
        keywordSuggestions: suggestions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: error.message || 'Unable to generate draft.' },
    });
  }
};

exports.createPost = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const post = await blogApi.createPost(token, mapPostPayload(req.body, getAdminEmail(req)));
    setNotice(req, 'success', `Post "${post.title}" created successfully.`);
    return res.redirect('/admin/blog');
  } catch (error) {
    setNotice(req, 'danger', `Create failed: ${error.message}`);
    return res.redirect('/admin/blog/new');
  }
};

exports.updatePost = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const post = await blogApi.updatePost(token, req.params.id, mapPostPayload(req.body, getAdminEmail(req)));
    setNotice(req, 'success', `Post "${post.title}" updated successfully.`);
  } catch (error) {
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect('/admin/blog');
};

exports.deletePost = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await blogApi.deletePost(token, req.params.id);
    setNotice(req, 'success', 'Post deleted successfully.');
  } catch (error) {
    setNotice(req, 'danger', `Delete failed: ${error.message}`);
  }

  return res.redirect('/admin/blog');
};

exports.togglePublished = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const post = await blogApi.getPost(token, req.params.id);
    const nextPublished = !post.isPublished;
    const payload = { isPublished: nextPublished };
    if (nextPublished && !post.publishedAt) {
      payload.publishedAt = new Date().toISOString();
    }
    await blogApi.updatePost(token, req.params.id, payload);
    setNotice(
      req,
      'success',
      nextPublished
        ? `Post "${post.title}" is now shown on the public site.`
        : `Post "${post.title}" is now a draft (hidden from the public site).`,
    );
  } catch (error) {
    setNotice(req, 'danger', `Status update failed: ${error.message}`);
  }

  return res.redirect('/admin/blog');
};

exports.approvePendingComments = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const post = await blogApi.getPost(token, req.params.id);
    const actorEmail = getAdminEmail(req);
    const comments = normalizeCommentsForAudit(post.comments, actorEmail, { forceApprovePending: true });

    await blogApi.updatePost(token, req.params.id, { comments });
    setNotice(req, 'success', 'All pending comments and replies were approved.');
  } catch (error) {
    setNotice(req, 'danger', `Approve failed: ${error.message}`);
  }

  return res.redirect('/admin/blog?commentState=pending');
};

exports.clearPendingComments = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const post = await blogApi.getPost(token, req.params.id);
    const actorEmail = getAdminEmail(req);
    const comments = normalizeCommentsForAudit(post.comments, actorEmail, { clearPending: true });

    await blogApi.updatePost(token, req.params.id, { comments });
    setNotice(req, 'success', 'Pending comments and replies were cleared.');
  } catch (error) {
    setNotice(req, 'danger', `Clear failed: ${error.message}`);
  }

  return res.redirect('/admin/blog?commentState=pending');
};