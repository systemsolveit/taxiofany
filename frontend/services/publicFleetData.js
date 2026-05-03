const carsApi = require('./carsApi');
const { asArray, warnDev } = require('./apiListUtils');

/**
 * Published cars for public pages (user API enforces isPublished).
 * Driver roster is not loaded for the public site.
 */
async function loadPublicFleetData() {
  const carsRaw = await carsApi.listCars().catch((err) => {
    warnDev('publicFleet cars', err);
    return [];
  });

  return {
    cars: asArray(carsRaw),
    drivers: [],
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
