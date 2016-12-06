/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/user-profiles              ->  index
 * POST    /api/user-profiles              ->  create
 * GET     /api/user-profiles/:id          ->  show
 * PUT     /api/user-profiles/:id          ->  update
 * DELETE  /api/user-profiles/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import UserProfile from './user-profile.model';

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
	  console.log(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of UserProfiles
export function index(req, res) {
  return UserProfile.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single UserProfile from the DB
export function show(req, res) {
  return UserProfile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new UserProfile in the DB
export function create(req, res) {
  return UserProfile.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing UserProfile in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return UserProfile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a UserProfile from the DB
export function destroy(req, res) {
  return UserProfile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
