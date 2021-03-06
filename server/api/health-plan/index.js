'use strict';

var express = require('express');
var controller = require('./health-plan.controller');

var router = express.Router();

router.get('/', controller.index);
//router.use('/all-cities', require('./all-cities'));
router.get('/:operatorId-:codId', controller.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);


/* Get the proposal params and finds plans the result */
router.get('/state/:state', controller.findByCityStateAndOperator);
router.get('/state/:state/city/:city', controller.findByCityStateAndOperator);
router.get('/state/:state/city/:city/operator/:operator', controller.findByCityStateAndOperator);

// router.get('/state/:state', controller.index);
// router.get('/state/:state/city/:city', controller.index);
// router.get('/state/:state/city/:city/operator/:operator', controller.index);


module.exports = router;
