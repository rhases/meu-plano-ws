/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/providers              ->  index
 * POST    /api/providers              ->  create
 * GET     /api/providers/:id          ->  show
 * PUT     /api/providers/:id          ->  update
 * DELETE  /api/providers/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Provider from './provider.model';

var logger = require('log4js').getLogger('provider.appointment');

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

// Gets a list of Providers
export function index(req, res) {
  return Provider.find()
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Provider from the DB
export function show(req, res) {
  return Provider.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Provider in the DB
export function create(req, res) {
  return Provider.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Provider in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Provider.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Provider from the DB
export function destroy(req, res) {
  return Provider.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


export function findByParams(req, res, next) {
	return prepareQuery(req.params)
	.exec()
	.then(respondWithResult(res))
	.catch(handleError(res));
}

function prepareQuery(params, handler) {
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

	logger.trace("The match is " + JSON.stringify(match));
	return Provider.find(match);
}
