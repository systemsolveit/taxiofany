const carsApi = require('../../services/adminCarsApi');

function consumeNotice(req) {
  const notice = req.session ? req.session.carsNotice : null;
  if (req.session) {
    delete req.session.carsNotice;
  }
  return notice;
}

function setNotice(req, type, message) {
  if (req.session) {
    req.session.carsNotice = { type, message };
  }
}

function getAdminToken(req) {
  return req.session && req.session.admin ? req.session.admin.token : null;
}

function mapPayload(body = {}) {
  return {
    title: String(body.title || '').trim(),
    slug: String(body.slug || '').trim(),
    city: String(body.city || '').trim(),
    image: String(body.image || '').trim(),
    detailImage: String(body.detailImage || '').trim(),
    pricePerKm: Number(body.pricePerKm),
    initialCharge: Number(body.initialCharge),
    perMileKm: Number(body.perMileKm),
    perStoppedTraffic: Number(body.perStoppedTraffic),
    passengers: Number(body.passengers),
    transmission: String(body.transmission || '').trim(),
    mileage: String(body.mileage || '').trim(),
    engine: String(body.engine || '').trim(),
    airCondition: body.airCondition === 'true' || body.airCondition === 'on',
    luggageCarry: Number(body.luggageCarry),
    description: String(body.description || '').trim(),
    displayOrder: Number(body.displayOrder) || 0,
    isPublished: body.isPublished === 'true' || body.isPublished === 'on',
  };
}

exports.listPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const cars = await carsApi.listCars(token);
    return res.render('admin/cars/list', {
      pageTitle: 'Cars Management',
      activeSection: 'cars',
      cars,
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
};

exports.newPage = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  return res.render('admin/cars/form', {
    pageTitle: 'Create Car',
    activeSection: 'cars',
    mode: 'create',
    car: {
      title: '', slug: '', city: '',
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
      description: '',
      displayOrder: 0,
      isPublished: false,
    },
    notice: consumeNotice(req),
  });
};

exports.editPage = async (req, res, next) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const car = await carsApi.getCar(token, req.params.id);
    return res.render('admin/cars/form', {
      pageTitle: 'Edit Car',
      activeSection: 'cars',
      mode: 'edit',
      car,
      notice: consumeNotice(req),
    });
  } catch (error) {
    return next(error);
  }
};

exports.createCar = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const car = await carsApi.createCar(token, mapPayload(req.body));
    setNotice(req, 'success', `Car "${car.title}" created successfully.`);
    return res.redirect('/admin/cars');
  } catch (error) {
    setNotice(req, 'danger', `Create failed: ${error.message}`);
    return res.redirect('/admin/cars/new');
  }
};

exports.updateCar = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const car = await carsApi.updateCar(token, req.params.id, mapPayload(req.body));
    setNotice(req, 'success', `Car "${car.title}" updated successfully.`);
  } catch (error) {
    setNotice(req, 'danger', `Update failed: ${error.message}`);
  }

  return res.redirect('/admin/cars');
};

exports.togglePublished = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const current = await carsApi.getCar(token, req.params.id);
    const nextPublished = !current.isPublished;
    await carsApi.updateCar(token, req.params.id, { isPublished: nextPublished });
    setNotice(
      req,
      'success',
      nextPublished
        ? `Car "${current.title}" is now shown on the public site.`
        : `Car "${current.title}" is now a draft (hidden from the public site).`,
    );
  } catch (error) {
    setNotice(req, 'danger', `Status update failed: ${error.message}`);
  }

  return res.redirect('/admin/cars');
};

exports.deleteCar = async (req, res) => {
  const token = getAdminToken(req);
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    await carsApi.deleteCar(token, req.params.id);
    setNotice(req, 'success', 'Car deleted successfully.');
  } catch (error) {
    setNotice(req, 'danger', `Delete failed: ${error.message}`);
  }

  return res.redirect('/admin/cars');
};
