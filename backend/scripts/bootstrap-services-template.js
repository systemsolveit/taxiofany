const { connectDatabase, mongoose } = require('../config/database');
const { Service } = require('../models');

/** Canonical public services (English stored on documents; nl/fr/en overrides via Translation keys service.<slug>.*). */
const BASE_SERVICES = [
  {
    title: 'Handicap Transport',
    slug: 'handicap-transport',
    shortDescription:
      'Wheelchair-accessible vans with ramps or lifts, trained drivers, secure restraint systems and 24/7 dispatch for hospital and care-home rides across Belgium.',
    description:
      'Taxiofany specialises in handicap and wheelchair-accessible transport. Our adapted fleet includes low-floor entry, side ramps and wheelchair lifts with ISO-compatible anchorage and four-point restraints. Drivers are trained for safe transfers and communication with passengers and caregivers. TFlex and Mutuelle billing paperwork can be prepared on request. We prioritise medical appointments, therapy visits and dignified daily mobility.',
    category: 'Accessibility',
    iconClass: 'las la-wheelchair',
    coverImage: '/assets/img/service-1.jpg',
    featureImage: '/assets/img/post-2.jpg',
    benefitsImage: '/assets/img/post-1.jpg',
    serviceCarImage: '/assets/img/car-1.png',
    features: [
      {
        iconClass: 'las la-ramp-loading',
        title: 'Ramps, lifts and securement',
        description: 'Vehicles equipped with access ramps or lifts, plus correct wheelchair tie-downs for every trip.',
      },
      {
        iconClass: 'las la-user-nurse',
        title: 'Trained accessibility drivers',
        description: 'Crews rehearse boarding angles, restraint checks and calm assistance for reduced mobility.',
      },
      {
        iconClass: 'las la-file-medical',
        title: 'TFlex / Mutuelle on request',
        description: 'Ask when booking—we provide confirmations and invoicing useful for many reimbursement schemes.',
      },
    ],
    benefitPoints: [
      'Companion seating when you book ahead',
      'Dispatch tuned for clinics, hospitals and care homes',
      'Same booking flow as business and regular taxi',
    ],
    tags: ['handicap', 'wheelchair', 'Belgium'],
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Business Transport',
    slug: 'business-transport',
    shortDescription:
      'Executive and corporate rides across Belgium—airport transfers, client visits and account-ready invoicing.',
    description:
      'Business transport delivers punctual, discreet mobility for teams and executives. Schedule airport transfers, multi-stop itineraries and recurring shuttle patterns with predictable service levels. Ideal for meetings, roadshows and airport corridors serving Brussels and regional hubs.',
    category: 'Business',
    iconClass: 'las la-briefcase',
    coverImage: '/assets/img/service-5.jpg',
    featureImage: '/assets/img/post-2.jpg',
    benefitsImage: '/assets/img/post-1.jpg',
    serviceCarImage: '/assets/img/car-1.png',
    features: [
      {
        iconClass: 'las la-calendar-check',
        title: 'Priority scheduling',
        description: 'Book recurring routes and hold slots for critical appointments.',
      },
      {
        iconClass: 'las la-plane-departure',
        title: 'Airport and station coverage',
        description: 'Flight-aware pickup windows and luggage-friendly vehicles.',
      },
      {
        iconClass: 'las la-file-invoice-dollar',
        title: 'Invoice-ready trips',
        description: 'Structured confirmations for finance teams and corporate policies.',
      },
    ],
    benefitPoints: [
      'Executive comfort and professional presentation',
      'Central coordination for multiple travellers',
      'Combine with handicap fleet when colleagues need accessible vehicles',
    ],
    tags: ['business', 'corporate', 'airport'],
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'Regular Transport',
    slug: 'regular-transport',
    shortDescription:
      'Everyday taxi rides with transparent pricing—city errands, evenings out and quick hops across Belgium.',
    description:
      'Regular transport covers standard taxi demand: shopping trips, social visits, station runs and late-night journeys. Use the same trusted Taxiofany dispatch and drivers when you do not need a wheelchair-accessible vehicle—simple booking and clear communication.',
    category: 'City',
    iconClass: 'las la-taxi',
    coverImage: '/assets/img/service-2.jpg',
    featureImage: '/assets/img/post-3.jpg',
    benefitsImage: '/assets/img/post-4.jpg',
    serviceCarImage: '/assets/img/car-1.png',
    features: [
      {
        iconClass: 'las la-shipping-fast',
        title: 'Fast urban pickups',
        description: 'Dispatch optimised for dense Belgian cities and suburbs.',
      },
      {
        iconClass: 'las la-wallet',
        title: 'Clear fares',
        description: 'Straightforward pricing with digital receipts when you need them.',
      },
      {
        iconClass: 'las la-headset',
        title: 'Friendly support',
        description: 'Reach dispatch for changes, delays or extra stops.',
      },
    ],
    benefitPoints: [
      'Ideal when mobility aids are not required',
      'Same booking channels as handicap and business transport',
      'Evening and weekend coverage subject to availability',
    ],
    tags: ['city', 'daily', 'taxi'],
    displayOrder: 3,
    isPublished: true,
  },
];

async function bootstrapServicesTemplate() {
  const operations = BASE_SERVICES.map((item) =>
    Service.updateOne({ slug: item.slug }, { $set: item }, { upsert: true })
  );

  await Promise.all(operations);

  return {
    count: BASE_SERVICES.length,
  };
}

/** CMS orchestrator handles wiping/reseeding; standalone CLI upserts only. */
async function shouldBootstrapServicesTemplate() {
  return false;
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
