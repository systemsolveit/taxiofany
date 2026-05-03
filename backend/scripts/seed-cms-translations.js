const { connectDatabase, mongoose } = require('../config/database');
const { Translation } = require('../models');
const { ensureLocale } = require('./seed-ui-translations-nl');
const { ensureLocale: ensureEnLocale } = require('./seed-ui-translations-en');
const { ensureLocale: ensureFrLocale } = require('./seed-ui-translations-fr');
const { SERVICE_BUNDLES, BLOG_BUNDLES, CATEGORY_LABELS } = require('./cms-translation-bundles');

function flattenServiceLocale(slug, bundle) {
  const out = {};
  if (!bundle) {
    return out;
  }
  out[`service.${slug}.title`] = bundle.title;
  out[`service.${slug}.shortDescription`] = bundle.shortDescription;
  out[`service.${slug}.description`] = bundle.description;
  (bundle.features || []).forEach((feature, index) => {
    out[`service.${slug}.feature.${index}.title`] = feature.title;
    out[`service.${slug}.feature.${index}.description`] = feature.description;
  });
  (bundle.benefitPoints || []).forEach((point, index) => {
    out[`service.${slug}.benefitPoint.${index}`] = point;
  });
  return out;
}

function flattenBlogLocale(slug, bundle) {
  const out = {};
  if (!bundle) {
    return out;
  }
  const fields = [
    'title',
    'excerpt',
    'content',
    'contentSecondary',
    'contentTertiary',
    'sectionHeading',
    'sectionParagraphOne',
    'sectionParagraphTwo',
    'quoteText',
    'quoteAuthor',
  ];
  fields.forEach((field) => {
    const value = bundle[field];
    if (typeof value === 'string' && value.trim()) {
      out[`blog.${slug}.${field}`] = value;
    }
  });
  return out;
}

function buildLocaleEntries(locale) {
  const entries = {};

  Object.entries(SERVICE_BUNDLES).forEach(([slug, locs]) => {
    const bundle = locs[locale];
    Object.assign(entries, flattenServiceLocale(slug, bundle));
  });

  Object.entries(BLOG_BUNDLES).forEach(([slug, locs]) => {
    const bundle = locs[locale];
    Object.assign(entries, flattenBlogLocale(slug, bundle));
  });

  Object.entries(CATEGORY_LABELS).forEach(([key, labels]) => {
    entries[`blog.category.${key}`] = labels[locale] || labels.en;
  });

  return entries;
}

async function seedCmsTranslations() {
  await ensureLocale();
  await ensureEnLocale();
  await ensureFrLocale();

  const locales = ['nl', 'fr', 'en'];
  const counts = { nl: 0, fr: 0, en: 0 };
  const operations = [];

  locales.forEach((locale) => {
    const flat = buildLocaleEntries(locale);
    counts[locale] = Object.keys(flat).length;
    Object.entries(flat).forEach(([key, value]) => {
      operations.push({
        updateOne: {
          filter: { locale, key },
          update: { $set: { value } },
          upsert: true,
        },
      });
    });
  });

  if (operations.length) {
    await Translation.bulkWrite(operations, { ordered: false });
  }

  return {
    counts,
    totalOperations: operations.length,
  };
}

async function run() {
  await connectDatabase();
  const result = await seedCmsTranslations();
  console.log(
    `CMS translations upserted — nl: ${result.counts.nl}, fr: ${result.counts.fr}, en: ${result.counts.en} (total ops: ${result.totalOperations}).`
  );
  await mongoose.connection.close();
}

module.exports = {
  seedCmsTranslations,
  buildLocaleEntries,
  run,
};

if (require.main === module) {
  run().catch((error) => {
    console.error('Failed to seed CMS translations:', error.message);
    process.exitCode = 1;
  });
}
