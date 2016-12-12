/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/health-insurance/health-plans              ->  index
 * POST    /api/health-insurance/health-plans              ->  create
 * GET     /api/health-insurance/health-plans/:id          ->  show
 * PUT     /api/health-insurance/health-plans/:id          ->  update
 * DELETE  /api/health-insurance/health-plans/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import HealthPlan from './health-plan.model';

var logger = require('log4js').getLogger('controller.health-plan');

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

function isEnabledArrayType(res) {
    return function(entity) {
        return entity.filter(function(obj) {
            return obj.enabled;
        });
    }
}

function isEnabled(res) {
    return function(entity) {
        if (entity.enabled)
            return entity;

        return null;
    }
}

// Gets a list of HealthPlans
export function index(req, res) {
  return HealthPlan.find().populate('operator').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single HealthPlan from the DB
export function show(req, res) {
  return HealthPlan.findById(req.params.id).populate('operator').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new HealthPlan in the DB
export function create(req, res) {
  return HealthPlan.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing HealthPlan in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return HealthPlan.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a HealthPlan from the DB
export function destroy(req, res) {
  return HealthPlan.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


export function findByCityStateAndOperator(req, res, next) {
	logger.debug("Finding health plans... " + JSON.stringify(req.params));

	prepareQueryByCityStateAndOperator(req.params).exec()
        .then(isEnabledArrayType(res))
		.then(respondWithResult(res))
		.catch(handleError(res))
		.done();
}

// ------------------------------------------------------------------------------
function prepareQueryByCityStateAndOperator(params) {
	if (!params.state)
		return;

	var match = {};

	if (params.operator)
		match['_id.operator'] = params.operator;

    return HealthPlan.find(_.merge(match, {
		"$or": [
			{ "coverageArea": { "$exists": false } },
			{
				"coverageArea": {
					"$elemMatch": {
						"$or": [
							{ "state": { "$exists": false }},
							{
								"$and": [
									{ "state": params.state.toLowerCase() },
									params.city ?
										{
											"$or": [
												{ "cities": { "$exists": false }},
												{ "cities": { "$size": 0 }},
												{ "cities": params.city },
											]
										} : {}
								]
							}
						]
					}
				}
		    }
		]
	}))
	.populate('operator');
}


function calculateTotalLifes(lifes) {
	var totalLifes = 0;
	if (lifes) {
		totalLifes = lifes.a18orLess + lifes.a19to23 + lifes.a24to28 + lifes.a29to33 + lifes.a34to38
			+ lifes.a39to43 + lifes.a44to48 + lifes.a49to53 + lifes.a54to58 + lifes.a59orMore;
	}
	return totalLifes;
}
