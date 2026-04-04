const { connectDatabase, mongoose } = require('../config/database');
const { Translation, Locale } = require('../models');
const adminI18nService = require('../features/admin/i18n/service');

function parseArgs(argv) {
  const flags = new Map();
  argv.forEach((item) => {
    const [key, value] = String(item).split('=');
    if (key && key.startsWith('--')) {
      flags.set(key.slice(2), value === undefined ? 'true' : value);
    }
  });
  return flags;
}

function toBoolean(value) {
  return String(value || '').toLowerCase() === 'true';
}

async function ensureLocale(locale, baseLocale) {
  const code = String(locale || '').trim().toLowerCase();
  if (!code) {
    throw new Error('Locale is required. Use --locale=nl');
  }

  const existing = await Locale.findOne({ code }).lean();
  if (existing) {
    if (typeof existing.isActive !== 'boolean' || existing.isActive === false) {
      await Locale.updateOne({ code }, { $set: { isActive: true } });
    }
    return;
  }

  const cleanBase = String(baseLocale || '').trim().toLowerCase();
  await Locale.create({
    code,
    label: code.toUpperCase(),
    baseLocale: cleanBase && cleanBase !== code ? cleanBase : null,
    isActive: true,
  });
}

async function run() {
  const flags = parseArgs(process.argv.slice(2));
  const targetLocale = String(flags.get('locale') || 'nl').toLowerCase();
  const sourceLocale = String(flags.get('source') || 'en').toLowerCase();
  const overwrite = toBoolean(flags.get('overwrite'));
  const limit = Number(flags.get('limit') || 50000);

  await connectDatabase();

  await ensureLocale(targetLocale, sourceLocale);

  const keywords = adminI18nService.extractKeywords(limit);
  const seen = new Set();
  const operations = [];

  keywords.forEach((item) => {
    const key = String(item && item.suggestedKey ? item.suggestedKey : '').trim();
    const value = String(item && item.text ? item.text : '').trim();

    if (!key || !value || seen.has(key)) {
      return;
    }

    seen.add(key);

    if (overwrite) {
      operations.push({
        updateOne: {
          filter: { locale: targetLocale, key },
          update: { $set: { value } },
          upsert: true,
        },
      });
      return;
    }

    operations.push({
      updateOne: {
        filter: { locale: targetLocale, key },
        update: { $setOnInsert: { value } },
        upsert: true,
      },
    });
  });

  if (!operations.length) {
    console.log('No translation keys found to insert.');
    return;
  }

  const result = await Translation.bulkWrite(operations, { ordered: false });
  const inserted = Number(result.upsertedCount || 0);
  const modified = Number(result.modifiedCount || 0);
  const matched = Number(result.matchedCount || 0);

  console.log('Translation key generation completed.');
  console.log(`Locale: ${targetLocale}`);
  console.log(`Scanned keywords: ${seen.size}`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Modified: ${modified}`);
  console.log(`Matched existing: ${matched}`);
  console.log(`Overwrite mode: ${overwrite ? 'enabled' : 'disabled'}`);
}

run()
  .catch((error) => {
    console.error('Failed to generate i18n keys:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      // Ignore shutdown errors.
    }
  });
