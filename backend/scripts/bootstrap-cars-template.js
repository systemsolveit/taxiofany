const { connectDatabase } = require('../config/database');
const { Car } = require('../models');

const BASE_CARS = [
  {
    title: 'BMW X5 2008',
    slug: 'bmw-x5-2008',
    city: 'Chicago',
    image: '/assets/img/pricing-car.png',
    detailImage: '/assets/img/car-2.png',
    pricePerKm: 2.5,
    initialCharge: 2.5,
    perMileKm: 4.2,
    perStoppedTraffic: 1.5,
    passengers: 4,
    transmission: 'Auto',
    mileage: '170K',
    engine: '6.5L LP petrol',
    airCondition: true,
    luggageCarry: 4,
    description: 'Comfort-focused SUV option suitable for airport and city transfers with smooth ride handling.',
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Mercedes-Benz Executive',
    slug: 'mercedes-benz-executive',
    city: 'Florida',
    image: '/assets/img/pricing-car.png',
    detailImage: '/assets/img/car-2.png',
    pricePerKm: 3.5,
    initialCharge: 3,
    perMileKm: 4.8,
    perStoppedTraffic: 1.8,
    passengers: 4,
    transmission: 'Auto',
    mileage: '95K',
    engine: '4.0L Petrol',
    airCondition: true,
    luggageCarry: 3,
    description: 'Executive sedan tier with premium interior and priority dispatch for business users.',
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'Hyundai 2022 CityRide',
    slug: 'hyundai-2022-cityride',
    city: 'New York',
    image: '/assets/img/pricing-car.png',
    detailImage: '/assets/img/car-2.png',
    pricePerKm: 4.5,
    initialCharge: 2.5,
    perMileKm: 4.2,
    perStoppedTraffic: 1.5,
    passengers: 4,
    transmission: 'Auto',
    mileage: '70K',
    engine: '2.0L Petrol',
    airCondition: true,
    luggageCarry: 3,
    description: 'Modern city vehicle tuned for short and medium distance trips with strong fuel efficiency.',
    displayOrder: 3,
    isPublished: true,
  },
];

async function bootstrapCarsTemplate() {
  const operations = BASE_CARS.map((item) => Car.updateOne({ slug: item.slug }, { $set: item }, { upsert: true }));
  await Promise.all(operations);
  return { count: BASE_CARS.length };
}

async function shouldBootstrapCarsTemplate() {
  const count = await Car.countDocuments({});
  return count === 0;
}

async function run() {
  await connectDatabase();
  const result = await bootstrapCarsTemplate();
  console.log(`Car template records upserted: ${result.count}`);
  process.exit(0);
}

if (require.main === module) {
  run().catch((error) => {
    console.error('Failed to bootstrap car templates:', error.message);
    process.exit(1);
  });
}

module.exports = {
  BASE_CARS,
  bootstrapCarsTemplate,
  shouldBootstrapCarsTemplate,
};
