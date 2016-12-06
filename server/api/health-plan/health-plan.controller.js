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
import Procedure from './health-plan.model';

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
  return HealthPlan.find().populate('Procedure').populate('planTables').exec()
    .then(isEnabledArrayType(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single HealthPlan from the DB
export function show(req, res) {
  return HealthPlan.findById(req.params.id).populate('Procedure').populate('planTables').exec()
    .then(isEnabled(res))
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


export function findByCityStateAndTag(req, res, next) {
	logger.debug("Finding health plans... " + JSON.stringify(req.params));

	prepareQueryByCityStateAndTag(req.params).exec()
        .then(isEnabledArrayType(res))
		.then(respondWithResult(res))
		.catch(handleError(res))
		.done();
}

// ------------------------------------------------------------------------------
function prepareQueryByCityStateAndTag(params) {
	if (!params.state)
		return;

    return HealthPlan.find({
		"$or": [
			{ "restrictions.geographic": { "$exists": false } },
			{
				"restrictions.geographic": {
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
	})
	.populate (
		{
			path: 'planTables',
			match: preparePlanTableQuery(params)
		}
	)
	.populate('Procedure');
}

function preparePlanTableQuery(params) {
	var match = {};

	// var totalLifes = calculateTotalLifes(params.lifes);
	// if(totalLifes > 0) {
	// 	match["requirements.minLifes"] = { $lte: totalLifes };
	// 	match["requirements.maxLifes"] = { $gte: totalLifes };
	// }

	if(params.tags) {
		var tags = params.tags.replace(/-/g, ' ').split(',');
		if(tags && tags != "undefined") {
			match["requirements.tags"] = { $in: tags };
		}
	}

	return match;
}

function calculateTotalLifes(lifes) {
	var totalLifes = 0;
	if (lifes) {
		totalLifes = lifes.a18orLess + lifes.a19to23 + lifes.a24to28 + lifes.a29to33 + lifes.a34to38
			+ lifes.a39to43 + lifes.a44to48 + lifes.a49to53 + lifes.a54to58 + lifes.a59orMore;
	}
	return totalLifes;
}