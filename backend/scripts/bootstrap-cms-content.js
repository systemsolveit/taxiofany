const { connectDatabase, mongoose } = require('../config/database');
const { Service, BlogPost, BootstrapMarker } = require('../models');
const { bootstrapServicesTemplate } = require('./bootstrap-services-template');
const { bootstrapBlogTemplate } = require('./bootstrap-blog-template');
const { seedCmsTranslations } = require('./seed-cms-translations');

const CMS_MARKER_KEY = 'cmsSeedVersion';
const CMS_SEED_VERSION = 'v2-handicap-3svc-7blog';

async function shouldBootstrapCmsTemplate() {
  const doc = await BootstrapMarker.findOne({ key: CMS_MARKER_KEY }).lean();
  return !doc || String(doc.value) !== CMS_SEED_VERSION;
}

async function bootstrapCmsTemplate() {
  await Service.deleteMany({});
  await BlogPost.deleteMany({});

  const servicesResult = await bootstrapServicesTemplate();
  const blogResult = await bootstrapBlogTemplate();
  const i18nResult = await seedCmsTranslations();

  await BootstrapMarker.updateOne(
    { key: CMS_MARKER_KEY },
    { $set: { value: CMS_SEED_VERSION } },
    { upsert: true }
  );

  return {
    servicesCount: servicesResult.count,
    postsCount: blogResult.count,
    translations: i18nResult,
  };
}

async function run() {
  await connectDatabase();
  if (!(await shouldBootstrapCmsTemplate())) {
    console.log(`CMS seed skipped — marker already at ${CMS_SEED_VERSION}.`);
    try {
      await mongoose.connection.close();
    } catch (e) {
      // ignore
    }
    process.exit(0);
    return;
  }
  const result = await bootstrapCmsTemplate();
  console.log(
    `CMS seed complete — services: ${result.servicesCount}, blog posts: ${result.postsCount}, translation ops: ${result.translations.totalOperations}.`
  );
  await mongoose.connection.close();
}

module.exports = {
  shouldBootstrapCmsTemplate,
  bootstrapCmsTemplate,
  CMS_SEED_VERSION,
  CMS_MARKER_KEY,
  run,
};

if (require.main === module) {
  run().catch((error) => {
    console.error('Failed to bootstrap CMS content:', error.message);
    process.exitCode = 1;
  });
}
