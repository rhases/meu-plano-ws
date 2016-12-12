'use strict';

var express = require('express');
var controller = require('./procedure.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);


/* Get the proposal params and finds plans the result */

module.exports = router;
