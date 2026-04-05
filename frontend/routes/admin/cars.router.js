const express = require('express');
const controller = require('../../controllers/admin/cars.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/new', controller.newPage);
router.post('/new', controller.createCar);
router.get('/:id/edit', controller.editPage);
router.post('/:id/update', controller.updateCar);
router.post('/:id/delete', controller.deleteCar);

module.exports = router;
