const carsApi = require('../../services/carsApi');

async function listCarsSafely() {
  try {
    const items = await carsApi.listCars();
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

exports.listPage = async (req, res) => {
  const cars = await listCarsSafely();
  res.render('users/taxi/list', { cars });
};

exports.detailsPage = async (req, res) => {
  const slug = req.params.slug || req.query.car;
  const cars = await listCarsSafely();
  let car = null;

  if (slug) {
    try {
      car = await carsApi.getCarBySlug(slug);
    } catch (error) {
      car = null;
    }
  }

  if (!car && cars.length) {
    car = cars[0];
  }

  const relatedCars = cars.filter((item) => !car || String(item.slug) !== String(car.slug)).slice(0, 6);
  res.render('users/taxi/details', { car, relatedCars });
};
