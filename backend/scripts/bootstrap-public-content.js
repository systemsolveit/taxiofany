const { connectDatabase } = require('../config/database');
const { Testimonial, Package } = require('../models');

const BASE_TESTIMONIALS = [
  {
    name: 'Eredrik Johanson',
    company: 'Financial INC',
    quote: 'Reliable transportation was available exactly when and where I needed it. The booking experience was quick and the driver was professional.',
    avatar: '/assets/img/profile-avatar.svg',
    displayOrder: 1,
    isPublished: true,
  },
  {
    name: 'Mauricio Fernández',
    company: 'Business Traveler',
    quote: 'Taxiofany made our airport transfer simple, comfortable, and on time. I would recommend the service for both business and family trips.',
    avatar: '/assets/img/profile-avatar.svg',
    displayOrder: 2,
    isPublished: true,
  },
  {
    name: 'Javier F. Arébalo',
    company: 'Local Customer',
    quote: 'Clean cars, friendly drivers, and clear communication from pickup to destination. It is now my preferred taxi service.',
    avatar: '/assets/img/profile-avatar.svg',
    displayOrder: 3,
    isPublished: true,
  },
];

const BASE_PACKAGES = [
  {
    title: 'Standard',
    slug: 'standard',
    summary: 'Comfortable daily rides for city travel.',
    priceLabel: 'Best for everyday trips',
    features: ['Professional driver', 'City pickup', 'Transparent fare'],
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Business',
    slug: 'business',
    summary: 'Priority transport for meetings and corporate schedules.',
    priceLabel: 'For teams and executives',
    features: ['Priority scheduling', 'Comfort vehicles', 'Business support'],
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'VIP',
    slug: 'vip',
    summary: 'Premium rides with elevated comfort and service attention.',
    priceLabel: 'Premium experience',
    features: ['Premium vehicle', 'Dedicated support', 'Extra comfort'],
    displayOrder: 3,
    isPublished: true,
  },
];

async function bootstrapPublicContent() {
  await Promise.all(BASE_TESTIMONIALS.map((item) => Testimonial.updateOne(
    { name: item.name },
    { $set: item },
    { upsert: true }
  )));

  await Promise.all(BASE_PACKAGES.map((item) => Package.updateOne(
    { slug: item.slug },
    { $set: item },
    { upsert: true }
  )));

  return {
    testimonials: BASE_TESTIMONIALS.length,
    packages: BASE_PACKAGES.length,
  };
}

async function shouldBootstrapPublicContent() {
  const [testimonialCount, packageCount] = await Promise.all([
    Testimonial.countDocuments({}),
    Package.countDocuments({}),
  ]);
  return testimonialCount === 0 || packageCount === 0;
}

async function run() {
  await connectDatabase();
  const result = await bootstrapPublicContent();
  console.log(`Public content records upserted: ${result.testimonials} testimonials, ${result.packages} packages`);
  process.exit(0);
}

if (require.main === module) {
  run().catch((error) => {
    console.error('Failed to bootstrap public content:', error.message);
    process.exit(1);
  });
}

module.exports = {
  BASE_TESTIMONIALS,
  BASE_PACKAGES,
  bootstrapPublicContent,
  shouldBootstrapPublicContent,
};
