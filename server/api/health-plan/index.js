'use strict';

var express = require('express');
var controller = require('./health-plan.controller');

var router = express.Router();

router.get('/', controller.index);
router.use('/all-cities', require('./all-cities'));
router.get('/:id', controller.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);


/* Get the proposal params and finds plans the result */
router.get('/state/:state', controller.findByCityStateAndTag);
router.get('/state/:state/city/:city', controller.findByCityStateAndTag);
router.get('/state/:state/city/:city/tags/:tags', controller.findByCityStateAndTag);


module.exports = router;
