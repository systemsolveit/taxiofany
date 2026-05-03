const { connectDatabase } = require('../config/database');
const { Car } = require('../models');

/** Mercedes Sprinter, Suzuki SX4, Toyota Proace Verso — see scripts/data/default-cars-mongo.js */
const BASE_CARS = require('./data/default-cars-mongo');

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
