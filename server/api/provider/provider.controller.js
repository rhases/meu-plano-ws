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
    .populate('doctors')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Provider from the DB
export function show(req, res) {
  return Provider.findById(req.params.id)
    .populate('doctors')
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
	prepareQuery(req.params)
	.then(respondWithResult(res))
	.catch(handleError(res))
	.done();
}

function prepareQuery(params, handler) {
	var match = {};

  logger.debug('preparing query for ' + JSON.stringify(params));

  if (params.area && params.area !== 'all') {
    match['address.area'] =  { $eq : params.area};
  }

	if (params.speciality && params.speciality !== 'all') {
		match['doctors'] =  { "$elemMatch" : { "speciality" : params.speciality} };
	}

	if (params.plan && params.plan !== 'all') {
		match['plans'] = { $in: [ params.plan ] };
	}

	logger.trace("The match is " + JSON.stringify(match));

	return Provider.find(match);
}
