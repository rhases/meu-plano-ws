/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/health-insurance/Operators              ->  index
 * POST    /api/health-insurance/Operators              ->  create
 * GET     /api/health-insurance/Operators/:id          ->  show
 * PUT     /api/health-insurance/Operators/:id          ->  update
 * DELETE  /api/health-insurance/Operators/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Operator from './operator.model';

var logger = require('log4js').getLogger('controller.operator');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
	if (!entity)
	  return;
    var updated = entity.merge(updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Operators
export function index(req, res) {
  return Operator.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Operator from the DB
export function show(req, res) {
  return Operator.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Operator in the DB
export function create(req, res) {
  return Operator.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Operator in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Operator.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Operator from the DB
export function destroy(req, res) {
  return Operator.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


export function findByName(req, res, next) {
	prepareQueryOperatorByName(req.params.Operator_name.replace(/-/g, ' ')).exec()
	.then(respondWithResult(res))
	.catch(handleError(res))
	.done();
}

function prepareQueryOperatorByName(name) {
	logger.trace("Finding Operator by name... " + name);

	return Operator.findOne({'name': new RegExp('^'+name+'$', "i") })
		.populate({
			'path': 'healthPlans',
			'populate': { path: 'planTables' }
		});
}
