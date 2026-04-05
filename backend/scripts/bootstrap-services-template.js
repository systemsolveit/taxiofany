const { connectDatabase } = require('../config/database');
const { Service } = require('../models');

const BASE_SERVICES = [
  {
    title: 'Regular Transport',
    slug: 'regular-transport',
    shortDescription: 'Reliable rides for daily city travel with transparent pricing.',
    description: 'Our regular transport service is designed for day-to-day commuting, shopping trips, and family travel. Expect punctual pickups, clean vehicles, and route-aware drivers who optimize time and comfort.',
    category: 'City',
    iconClass: 'las la-taxi',
    coverImage: '/assets/img/service-1.jpg',
    featureImage: '/assets/img/post-2.jpg',
    benefitsImage: '/assets/img/post-1.jpg',
    features: [
      { iconClass: 'las la-shipping-fast', title: 'Fast Pickups', description: 'Average dispatch times tuned for urban zones.' },
      { iconClass: 'las la-user-shield', title: 'Verified Drivers', description: 'Trained and verified professionals for safer rides.' },
      { iconClass: 'las la-wallet', title: 'Fair Pricing', description: 'Transparent fare policy with no hidden fees.' },
    ],
    benefitPoints: ['24/7 booking support', 'GPS tracked rides', 'Digital receipts'],
    tags: ['city', 'daily', 'transport'],
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Airport Transport',
    slug: 'airport-transport',
    shortDescription: 'On-time airport pickups and drop-offs with luggage support.',
    description: 'Avoid last-minute airport stress with dedicated transfer scheduling, real-time traffic handling, and flight-aware dispatch coordination.',
    category: 'Airport',
    iconClass: 'las la-plane-departure',
    coverImage: '/assets/img/service-2.jpg',
    featureImage: '/assets/img/post-2.jpg',
    benefitsImage: '/assets/img/post-1.jpg',
    features: [
      { iconClass: 'las la-clock', title: 'Scheduled in Advance', description: 'Book rides ahead to secure timing windows.' },
      { iconClass: 'las la-suitcase-rolling', title: 'Luggage Assistance', description: 'Extra help for baggage handling when needed.' },
      { iconClass: 'las la-route', title: 'Traffic-Optimized Routes', description: 'Dynamic route updates to keep you on schedule.' },
    ],
    benefitPoints: ['Terminal pickup options', 'Corporate transfer support', 'Late-night availability'],
    tags: ['airport', 'transfer', 'travel'],
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'Business Transport',
    slug: 'business-transport',
    shortDescription: 'Professional mobility solutions for teams and executives.',
    description: 'Business transport combines punctuality, discretion, and service consistency for executive travel, partner meetings, and corporate accounts.',
    category: 'Business',
    iconClass: 'las la-briefcase',
    coverImage: '/assets/img/service-5.jpg',
    featureImage: '/assets/img/post-2.jpg',
    benefitsImage: '/assets/img/post-1.jpg',
    features: [
      { iconClass: 'las la-calendar-check', title: 'Priority Scheduling', description: 'Service-level commitments for high-priority trips.' },
      { iconClass: 'las la-file-invoice-dollar', title: 'Centralized Billing', description: 'Monthly billing and trip-level reporting.' },
      { iconClass: 'las la-headset', title: 'Account Support', description: 'Dedicated assistance for corporate coordinators.' },
    ],
    benefitPoints: ['Invoice-ready reports', 'Executive comfort standards', 'Multi-user booking controls'],
    tags: ['business', 'corporate', 'executive'],
    displayOrder: 3,
    isPublished: true,
  },
];

async function bootstrapServicesTemplate() {
  const operations = BASE_SERVICES.map((item) => Service.updateOne(
    { slug: item.slug },
    { $set: item },
    { upsert: true }
  ));

  await Promise.all(operations);

  return {
    count: BASE_SERVICES.length,
  };
}

async function shouldBootstrapServicesTemplate() {
  const count = await Service.countDocuments({});
  return count === 0;
}

async function run() {
  await connectDatabase();
  const result = await bootstrapServicesTemplate();
  console.log(`Service template records upserted: ${result.count}`);
  process.exit(0);
}

if (require.main === module) {
  run().catch((error) => {
    console.error('Failed to bootstrap service templates:', error.message);
    process.exit(1);
  });
}

module.exports = {
  BASE_SERVICES,
  bootstrapServicesTemplate,
  shouldBootstrapServicesTemplate,
};
