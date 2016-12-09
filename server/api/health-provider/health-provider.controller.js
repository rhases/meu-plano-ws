/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/health-providers              ->  index
 * POST    /api/health-provider              ->  create
 * GET     /api/health-provider/:id          ->  show
 * PUT     /api/health-provider/:id          ->  update
 * DELETE  /api/health-provider/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import HealthProvider from './health-provider.model';

var logger = require('log4js').getLogger('health-provider.appointment');

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
    var updated = _.merge(entity, updates);
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

// Gets a list of HealthProviders
export function index(req, res) {
  return HealthProvider.find()
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single HealthProvider from the DB
export function show(req, res) {
  return HealthProvider.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new HealthProvider in the DB
export function create(req, res) {
  return HealthProvider.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing HealthProvider in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return HealthProvider.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a HealthProvider from the DB
export function destroy(req, res) {
	return HealthProvider.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
}

export function findByParams(req, res, next) {
	return HealthProvider.find(buildQuery(req.params))
		.exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
}

export function findByProcedure(req, res, next) {
	var match = buildQuery(req.params);
	match['healthPlans.procedures'] = req.params.procedure;
	return HealthProvider.find(match)
		.exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
}

export function findByMedicalSpecialty(req, res, next) {
	var match = buildQuery(req.params);
	match['healthPlans.medicalSpecialties'] = req.params.medicalSpecialty;
	return HealthProvider.find(match)
		.exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
}

function buildQuery(params) {
	var match = {};
	
	if (params.state) {
		match['address.state'] = params.state;
	}
	if (params.city) {
		match['address.city'] = params.city;
	}
	if (params.type) {
		match['type'] = params.type;
	}
	if (params.plan) {
		match['healthPlans'] = { $elemMatch: {"plan": params.plan } };
	}

	return match;
}
