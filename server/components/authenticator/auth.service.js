'use strict';

/**
 * Authenticator.
 */

import request from 'request';
import Q from 'q';
import _ from 'lodash';

import config from '../../config/environment';

var logger = require('log4js').getLogger('authenticator');

/**
 * #####  INTERNALS METHODS  #####
 */

// To compatibility
function getRoles(user) {
	var roles = [];
	if (user) {
		if (user.role)
			roles.push(user.role);

		if (user.roles) {
			for(var i = 0; i < user.roles.length; i++)
				roles.push(user.roles[i]);
		}
	}

	return roles;
}

function authenticate(req, res) {
	if(config.byPassAuthenticator) { // Da by pass do autheticator (used on tests)
		logger.info("By passign authenticator!");
		return Q.Promise(function(resolve, reject) {
			var fakeUser = {
				"_id": "576c32a24aaa8d03006f7c07",
				"updatedAt": "2016-06-23T19:04:02.246Z",
				"createdAt": "2016-06-23T19:04:02.246Z",
				"provider": "local",
				"name": "teste",
				"email": "teste1@test",
				"__v": 0,
				"roles": ["admin","user","provider"]
			};
			req.user = fakeUser;
			resolve(fakeUser);
		});
	}

	return Q.nfcall(request.get, {
			url: config.authenticator.uri + "/me",
			headers: { authorization: req.headers.authorization },
			json: true,
		})
		.then(function(data) {
			var response = data[0];
			var body = data[1];
			if (response.statusCode >= 300)
				throw 'Can not authenticate user. Reason: ' + JSON.stringify(body);
			return body;
		})
		.then(function(user) {
			req.user = user;
			return user;
		})
		.catch(function(err) {
			logger.error("Can not authenticate this request against authenticator server. Reason: " + err);
			res.status(401).send(err);
		});
}

/**
 * #####  UTILS  #####
 */

/**
 * Checks if request is authenticated
 */
export function isAuthenticated(req) {
	return req.user != undefined;
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(user, roleRequired) {
	return getRoles(user).indexOf(roleRequired) >= 0;
}


/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasAnyRole(user, anyRolesRequired) {
	var roles = getRoles(user);
	for(var i = 0; i < anyRolesRequired.length; i++) {
		if (roles.indexOf(anyRolesRequired[i]) >= 0) {
			return true;
		}
	}
	return false;
}


/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasAllRoles(user, allRolesRequired) {
	var roles = getRoles(user);
	for(var i = 0; i < allRolesRequired.length; i++) {
		if (!roles.indexOf(anyRolesRequired[i]) >= 0) {
			return false;
		}
	}
	return true;
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function getUserInfomations(email) {
	// TODO: Need to auth server-server

	return Q.nfcall(request.get, {
			url: config.authenticator.uri + "/email/" + email,
			// headers: { authorization: req.headers.authorization },
			json: true,
		})
		.then(function(data) {
			var response = data[0];
			var body = data[1];
			if (response.statusCode >= 300)
				throw 'Can not get user infos from authenticator server. Reason: ' + JSON.stringify(body);
			return body;
		})
		.then(function(user) {
			return user;
		})
		.catch(function(err) {
			logger.error("Can not get user infos from authenticator server. Reason: " + err);
		});
}

/**
 * #####  INTERCEPTORS  #####
 */

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function ensureIsAuthenticated() {
    return function(req, res, next) {
		authenticate(req, res)
			.then(function() {
				next();
			})
			.catch(function(err) {
				logger.error("Unexpected error. Reason: " + err);
				res.status(500).send(err);
			})
			.done();
        };
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function ensureHasRole(roleRequired) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return function(req, res, next) {
		authenticate(req, res)
			.then(function() {
				if (!req.user)
					return;

				if (hasRole(req.user, roleRequired)) {
	                next();
				} else {
					logger.error("Can not authenticate this request against authenticator server. Reason: This user '" + req.user.name + "/" +req.user.email+"' dont have the role '" + roleRequired + "'.");
					res.status(403).send('Forbidden');
				}
			})
			.catch(function(err) {
				logger.error("Unexpected error. Reason: " + err);
				res.status(500).send(err);
			})
			.done();
        };

}


/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function ensureHasAnyRole(anyRolesRequired) {
    if (!anyRolesRequired) {
        throw new Error('Required role needs to be set');
    }

    return function(req, res, next) {
		authenticate(req, res)
			.then(function() {
				if (!req.user)
					return;

				if (hasAnyRole(req.user, anyRolesRequired)) {
					next();
				} else {
					logger.error("Can not authenticate this request against authenticator server. Reason: This user '" + req.user.name + "/" +req.user.email+"' dont have the role '" + anyRolesRequired + "'.");
					res.status(403).send('Forbidden');
				}
			})
			.catch(function(err) {
				logger.error("Unexpected error. Reason: " + err);
				res.status(500).send(err);
			})
			.done();
        };

}


/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function ensureHasAllRoles(allRolesRequired) {
    if (!allRolesRequired) {
        throw new Error('Required role needs to be set');
    }

    return function(req, res, next) {
		authenticate(req, res)
			.then(function() {
				if (!req.user)
					return;
					
				if (hasAllRoles(req.user, allRolesRequired)) {
					next();
				} else {
					logger.error("Can not authenticate this request against authenticator server. Reason: This user '" + req.user.name + "/" +req.user.email+"' dont have the role '" + allRolesRequired + "'.");
					res.status(403).send('Forbidden');
				}
			})
			.catch(function(err) {
				logger.error("Unexpected error. Reason: " + err);
				res.status(500).send(err);
			})
			.done();
        };

}
