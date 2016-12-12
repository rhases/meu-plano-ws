/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/health-insurance/medical-specialties              ->  index
 * POST    /api/health-insurance/medical-specialties              ->  create
 * GET     /api/health-insurance/medical-specialties/:id          ->  show
 * PUT     /api/health-insurance/medical-specialties/:id          ->  update
 * DELETE  /api/health-insurance/medical-specialties/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import MedicalSpecialty from './medical-specialty.model';

var logger = require('log4js').getLogger('controller.medical-specialty');

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

// Gets a list of MedicalSpecialties
export function index(req, res) {
  return MedicalSpecialty.find().populate('healthPlans').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single MedicalSpecialty from the DB
export function show(req, res) {
  return MedicalSpecialty.findById(req.params.id).populate('healthPlans').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new MedicalSpecialty in the DB
export function create(req, res) {
  return MedicalSpecialty.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing MedicalSpecialty in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return MedicalSpecialty.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a MedicalSpecialty from the DB
export function destroy(req, res) {
  return MedicalSpecialty.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
