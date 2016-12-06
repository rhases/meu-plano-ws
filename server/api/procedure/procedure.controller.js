/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/health-insurance/procedures              ->  index
 * POST    /api/health-insurance/procedures              ->  create
 * GET     /api/health-insurance/procedures/:id          ->  show
 * PUT     /api/health-insurance/procedures/:id          ->  update
 * DELETE  /api/health-insurance/procedures/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Procedure from './procedure.model';

var logger = require('log4js').getLogger('controller.procedure');

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

// Gets a list of Procedures
export function index(req, res) {
  return Procedure.find().populate('healthPlans').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Procedure from the DB
export function show(req, res) {
  return Procedure.findById(req.params.id).populate('healthPlans').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Procedure in the DB
export function create(req, res) {
  return Procedure.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Procedure in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Procedure.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Procedure from the DB
export function destroy(req, res) {
  return Procedure.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


export function findByName(req, res, next) {
	prepareQueryProcedureByName(req.params.procedure_name.replace(/-/g, ' ')).exec()
	.then(respondWithResult(res))
	.catch(handleError(res))
	.done();
}

function prepareQueryProcedureByName(name) {
	logger.trace("Finding procedure by name... " + name);

	return Procedure.findOne({'name': new RegExp('^'+name+'$', "i") })
		.populate({
			'path': 'healthPlans',
			'populate': { path: 'planTables' }
		});
}
