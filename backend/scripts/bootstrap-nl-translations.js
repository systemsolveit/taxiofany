const { connectDatabase, mongoose } = require('../config/database');
const { Locale, Translation } = require('../models');
const adminI18nService = require('../features/admin/i18n/service');
const { entries: semanticEntries, ensureLocale } = require('./seed-ui-translations-nl');

async function seedSemanticEntries() {
  const operations = Object.entries(semanticEntries).map(([key, value]) => ({
    updateOne: {
      filter: { locale: 'nl', key },
      update: { $set: { value } },
      upsert: true,
    },
  }));

  if (!operations.length) {
    return 0;
  }

  await Translation.bulkWrite(operations, { ordered: false });
  return operations.length;
}

async function replaceStaleBrandTranslations() {
  const staleBrandPattern = new RegExp('r' + 'idek', 'ig');
  const staleEntries = await Translation.find({ value: staleBrandPattern }).lean();
  if (!staleEntries.length) {
    return 0;
  }

  const operations = staleEntries.map((entry) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: {
        $set: {
          value: String(entry.value || '').replace(staleBrandPattern, 'taxiOfany'),
        },
      },
    },
  }));

  await Translation.bulkWrite(operations, { ordered: false });
  return operations.length;
}

async function seedExtractedEntries() {
  const extracted = adminI18nService.extractKeywords(50000);
  const existing = await Translation.find({ locale: 'nl' }).lean();
  const existingKeys = new Set(existing.map((entry) => entry.key));

  const uniqueEntries = [];
  const seenKeys = new Set();

  extracted.forEach((item) => {
    const key = String(item && item.suggestedKey ? item.suggestedKey : '').trim();
    const value = String(item && item.text ? item.text : '').trim();

    if (!key || !value || existingKeys.has(key) || seenKeys.has(key)) {
      return;
    }

    seenKeys.add(key);
    uniqueEntries.push({ key, value });
  });

  if (!uniqueEntries.length) {
    return { extractedCount: extracted.length, translatedCount: 0 };
  }

  const operations = [];
  const batchSize = 50;

  for (let index = 0; index < uniqueEntries.length; index += batchSize) {
    const batch = uniqueEntries.slice(index, index + batchSize);
    const translated = await adminI18nService.translateKeywords({
      texts: batch.map((entry) => entry.value),
      source: 'auto',
      target: 'nl',
    });

    batch.forEach((entry, entryIndex) => {
      const translatedValue = translated[entryIndex] && translated[entryIndex].translated
        ? translated[entryIndex].translated
        : entry.value;

      operations.push({
        updateOne: {
          filter: { locale: 'nl', key: entry.key },
          update: { $set: { value: translatedValue } },
          upsert: true,
        },
      });
    });
  }

  if (operations.length) {
    await Translation.bulkWrite(operations, { ordered: false });
  }

  return {
    extractedCount: extracted.length,
    translatedCount: operations.length,
  };
}

async function shouldBootstrapNl() {
  const [localeCount, nlLocale, nlTranslationCount] = await Promise.all([
    Locale.countDocuments({}),
    Locale.findOne({ code: 'nl' }).lean(),
    Translation.countDocuments({ locale: 'nl' }),
  ]);

  if (localeCount === 0) {
    return true;
  }

  if (!nlLocale) {
    return true;
  }

  if (nlTranslationCount === 0) {
    return true;
  }

  const staleBrandTranslation = await Translation.exists({
    value: new RegExp('r' + 'idek', 'i'),
  });

  if (staleBrandTranslation) {
    return true;
  }

  return false;
}

async function bootstrapNlTranslations() {
  await ensureLocale();

  const replacedBrandCount = await replaceStaleBrandTranslations();
  const semanticCount = await seedSemanticEntries();
  const extractedResult = await seedExtractedEntries();

  return {
    locale: 'nl',
    replacedBrandCount,
    semanticCount,
    extractedCount: extractedResult.extractedCount,
    translatedCount: extractedResult.translatedCount,
  };
}

async function run() {
  await connectDatabase();

  const result = await bootstrapNlTranslations();

  console.log(`Locale ${result.locale} ensured.`);
  console.log(`Stale brand translations replaced: ${result.replacedBrandCount}`);
  console.log(`Semantic keys seeded: ${result.semanticCount}`);
  console.log(`Extracted page keys found: ${result.extractedCount}`);
  console.log(`Extracted page keys translated and saved: ${result.translatedCount}`);
}

module.exports = {
  shouldBootstrapNl,
  bootstrapNlTranslations,
  run,
};

if (require.main === module) {
  run()
    .catch((error) => {
      console.error('Failed to bootstrap nl translations:', error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      try {
        await mongoose.connection.close();
      } catch (error) {
        // Ignore close errors.
      }
    });
}