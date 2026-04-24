const carsApi = require('./carsApi');
const driversApi = require('./driversApi');
const { asArray, warnDev } = require('./apiListUtils');

/**
 * Published cars & drivers for public pages (user API enforces isPublished).
 */
async function loadPublicFleetData() {
  const [carsRaw, driversRaw] = await Promise.all([
    carsApi.listCars().catch((err) => {
      warnDev('publicFleet cars', err);
      return [];
    }),
    driversApi.listDrivers().catch((err) => {
      warnDev('publicFleet drivers', err);
      return [];
    }),
  ]);

  return {
    cars: asArray(carsRaw),
    drivers: asArray(driversRaw),
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
