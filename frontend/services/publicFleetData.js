const carsApi = require('./carsApi');
const driversApi = require('./driversApi');

/**
 * Published cars & drivers for public pages (API returns DB-backed lists).
 */
async function loadPublicFleetData() {
  const [cars, drivers] = await Promise.all([
    carsApi.listCars().catch(() => []),
    driversApi.listDrivers().catch(() => []),
  ]);

  return {
    cars: Array.isArray(cars) ? cars : [],
    drivers: Array.isArray(drivers) ? drivers : [],
  };
}

/**
 * Spread cars across N tab panes (round-robin) so legacy 3-tab pricing UI stays balanced.
 */
function splitCarsForPricingTabs(cars, tabCount = 3) {
  const buckets = Array.from({ length: tabCount }, () => []);
  (cars || []).forEach((car, index) => {
    buckets[index % tabCount].push(car);
  });
  return buckets;
}

module.exports = {
  loadPublicFleetData,
  splitCarsForPricingTabs,
};
