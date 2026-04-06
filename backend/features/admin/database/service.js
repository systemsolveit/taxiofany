const {
  Booking,
  Driver,
  Car,
  Service,
  BlogPost,
  EmailTemplate,
  ContactSubmission,
  Translation,
  Locale,
  User,
  IntegrationSetting,
} = require('../../../models');

const EXPORT_MODELS = [
  { name: 'locales', model: Locale },
  { name: 'translations', model: Translation },
  { name: 'users', model: User },
  { name: 'bookings', model: Booking },
  { name: 'drivers', model: Driver },
  { name: 'cars', model: Car },
  { name: 'services', model: Service },
  { name: 'blogPosts', model: BlogPost },
  { name: 'emailTemplates', model: EmailTemplate },
  { name: 'contactSubmissions', model: ContactSubmission },
  { name: 'integrationSettings', model: IntegrationSetting },
];

const CONTENT_RESET_MODELS = [
  Booking,
  Driver,
  Car,
  Service,
  BlogPost,
  EmailTemplate,
  ContactSubmission,
  Translation,
  Locale,
];

function stripUserSecrets(doc) {
  if (!doc || typeof doc !== 'object') {
    return doc;
  }
  const next = { ...doc };
  if (Object.prototype.hasOwnProperty.call(next, 'passwordHash')) {
    delete next.passwordHash;
  }
  return next;
}

async function exportDatabaseJson() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    collections: {},
  };

  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < EXPORT_MODELS.length; i += 1) {
    const { name, model } = EXPORT_MODELS[i];
    const rows = await model.find({}).lean();
    if (name === 'users') {
      payload.collections[name] = rows.map((row) => stripUserSecrets(row));
    } else {
      payload.collections[name] = rows;
    }
  }
  /* eslint-enable no-await-in-loop */

  return payload;
}

async function importDatabaseJson(payload, { dryRun = false } = {}) {
  if (!payload || typeof payload !== 'object' || !payload.collections || typeof payload.collections !== 'object') {
    const error = new Error('Invalid import payload: expected { collections: { ... } }.');
    error.statusCode = 400;
    throw error;
  }

  const stats = {};

  const run = async (label, fn) => {
    if (dryRun) {
      stats[label] = { dryRun: true };
      return;
    }
    const result = await fn();
    stats[label] = result;
  };

  const c = payload.collections;

  await run('locales', async () => {
    const items = Array.isArray(c.locales) ? c.locales : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (!doc || !doc.code) {
        /* ignore */
      } else {
        await Locale.findOneAndUpdate({ code: doc.code }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('translations', async () => {
    const items = Array.isArray(c.translations) ? c.translations : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (doc && doc._id) {
        await Translation.findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('integrationSettings', async () => {
    const items = Array.isArray(c.integrationSettings) ? c.integrationSettings : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (doc && doc.key) {
        await IntegrationSetting.findOneAndUpdate({ key: doc.key }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('emailTemplates', async () => {
    const items = Array.isArray(c.emailTemplates) ? c.emailTemplates : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (doc && doc.slug) {
        await EmailTemplate.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
        upserted += 1;
      } else if (doc && doc._id) {
        await EmailTemplate.findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('services', async () => {
    const items = Array.isArray(c.services) ? c.services : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (doc && doc._id) {
        await Service.findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('cars', async () => {
    const items = Array.isArray(c.cars) ? c.cars : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (doc && doc._id) {
        await Car.findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('drivers', async () => {
    const items = Array.isArray(c.drivers) ? c.drivers : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (doc && doc._id) {
        await Driver.findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('blogPosts', async () => {
    const items = Array.isArray(c.blogPosts) ? c.blogPosts : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (doc && doc.slug) {
        await BlogPost.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
        upserted += 1;
      } else if (doc && doc._id) {
        await BlogPost.findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('contactSubmissions', async () => {
    const items = Array.isArray(c.contactSubmissions) ? c.contactSubmissions : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (doc && doc._id) {
        await ContactSubmission.findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('bookings', async () => {
    const items = Array.isArray(c.bookings) ? c.bookings : [];
    let upserted = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (doc && doc._id) {
        await Booking.findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true });
        upserted += 1;
      }
    }
    return { upserted };
  });

  await run('users', async () => {
    const items = Array.isArray(c.users) ? c.users : [];
    let updated = 0;
    for (let i = 0; i < items.length; i += 1) {
      const doc = items[i];
      if (!doc || !doc.email) {
        /* ignore */
      } else {
        const { passwordHash, ...rest } = doc;
        const existing = await User.findOne({ email: String(doc.email).toLowerCase() }).lean();
        if (existing) {
          await User.updateOne({ _id: existing._id }, { $set: rest });
          updated += 1;
        }
      }
    }
    return {
      updated,
      note: 'Users without password hashes are not inserted; only existing users are updated.',
    };
  });

  return { dryRun, stats };
}

async function resetContent() {
  const superAdmins = await User.find({ role: 'super_admin' }).select('_id').lean();
  if (!superAdmins.length) {
    const error = new Error('Refusing to reset: no super_admin user exists.');
    error.statusCode = 400;
    error.code = 'NO_SUPER_ADMIN';
    throw error;
  }

  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < CONTENT_RESET_MODELS.length; i += 1) {
    const model = CONTENT_RESET_MODELS[i];
    await model.deleteMany({});
  }
  /* eslint-enable no-await-in-loop */

  return { reset: true };
}

async function seedDemoContent() {
  const serviceSlug = 'demo-airport-transfer';
  let service = await Service.findOne({ slug: serviceSlug }).lean();
  if (!service) {
    service = await Service.create({
      title: 'Airport transfer (demo)',
      shortDescription: 'Sample service created by demo seed.',
      description: 'This is demo content. You can edit or delete it from the admin panel.',
      iconClass: 'fas fa-plane',
      displayOrder: 1,
      isPublished: true,
    }).then((d) => d.toObject());
  }

  let driver = await Driver.findOne({ slug: 'demo-driver' }).lean();
  if (!driver) {
    driver = await Driver.create({
      fullName: 'Demo Driver',
      phone: '+1 555 0100',
      plateNumber: 'DEMO-001',
      displayOrder: 1,
      isPublished: true,
    }).then((d) => d.toObject());
  }

  let car = await Car.findOne({ slug: 'demo-city-sedan' }).lean();
  if (!car) {
    car = await Car.create({
      title: 'City Sedan (demo)',
      description: 'Demo vehicle for testing.',
      displayOrder: 1,
      isPublished: true,
    }).then((d) => d.toObject());
  }

  const blogSlug = 'welcome-to-taxiofany-demo';
  let post = await BlogPost.findOne({ slug: blogSlug }).lean();
  if (!post) {
    post = await BlogPost.create({
      title: 'Welcome to Taxiofany (demo post)',
      excerpt: 'Sample blog content from database seed.',
      content: '<p>This is a demo blog post. Remove it when you go live.</p>',
      isPublished: true,
    }).then((d) => d.toObject());
  }

  const bookingCode = 'DEMO-BOOK-1';
  let booking = await Booking.findOne({ bookingCode }).lean();
  if (!booking) {
    booking = await Booking.create({
      bookingCode,
      customerName: 'Demo Customer',
      customerEmail: 'demo.customer@example.com',
      pickupLocation: 'Central Station',
      destinationLocation: 'City Airport',
      status: 'pending',
      fareAmount: 49,
    }).then((d) => d.toObject());
  }

  return {
    seeded: {
      serviceId: service && service._id,
      driverId: driver && driver._id,
      carId: car && car._id,
      blogPostId: post && post._id,
      bookingId: booking && booking._id,
    },
  };
}

module.exports = {
  exportDatabaseJson,
  importDatabaseJson,
  resetContent,
  seedDemoContent,
};
