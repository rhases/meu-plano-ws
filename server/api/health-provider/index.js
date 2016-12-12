'use strict';

var express = require('express');
var controller = require('./health-provider.controller');

var router = express.Router();

//router.get('/', controller.index);

router.get('/:id', controller.show);

router.get('/:plan/:state/:city/:type', controller.findByParams);

router.get('/:plan/:state/:city/procedure/:procedure', controller.findByProcedure);
router.get('/:plan/:state/:city/medical-specialty/:medicalSpecialty', controller.findByMedicalSpecialty);

//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
