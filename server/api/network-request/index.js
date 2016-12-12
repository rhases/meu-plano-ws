'use strict';

var express = require('express');
var controller = require('./network-request.controller');

var router = express.Router();

// router.get('/', controller.index); // it will be never all listed
router.get('/:id', controller.show);
router.get('/user/:userId', controller.findByUser);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy); // it will never be deleted


/* Get the proposal params and finds plans the result */

module.exports = router;
