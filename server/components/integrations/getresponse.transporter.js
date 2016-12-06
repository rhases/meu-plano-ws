'use strict';

/**
 * Integration of rhases and get response.
 * API DOC: http://apidocs.getresponse.com/pl/v3/resources/contacts
 */

import request from 'request';
import Q from 'q';

var logger = require('log4js').getLogger('transporter.getresponse');

import config from '../../config/environment';

var defaultHeaders = {
	'X-Auth-Token': 'api-key ' + config.getResponse.apiKey,
	'Content-Type': 'application/json'
};

var transporter;
if (config.getResponse.apiKey && config.getResponse.campainId) {
	transporter = {};
	/**
	 * Find tag on cache, find on GetResponse, create a tag with this name.
	 */
	var tagCacheMap = {};
	transporter.loadOrCreateTag = function(tagName) {
		// Load the id of tag from GetResponse
		return transporter.loadTag(tagName)
			.catch(function(err) {
				// Create tag with this name
				return transporter.createTag(tagName)
					.then(function(tag) {
						logger.info('Tag "' + tagName + '" created.')
						return tag;
					})
			});
	}

	/**
	 * Load a tag with this name from GetResponse
	 */
	transporter.loadTag = function(tagName) {
		logger.debug('Loading tag "' + tagName + '"...')

		if (tagCacheMap[tagName]) {
			var deferred = Q.defer();
			logger.debug('Tag "' + tagName + '" in cache.')
			deferred.resolve(tagCacheMap[tagName]);
			return deferred.promise;
		}

		return Q.nfcall(request.get, {
				url: config.getResponse.baseUri + 'tags?query[name]=' + tagName,
				headers: defaultHeaders,
				json: true
			}).then(function(data) {
				var response = data[0];
				var body = data[1];
				if (response.statusCode >= 300 || !body || !body[0])
					throw 'Can not found tag: ' + JSON.stringify(body);
				return body[0];
			}).then(function(tag) {
				logger.info('Tag "' + tagName + '" loaded.')
				tagCacheMap[tagName] = tag;  // add on cache
				logger.debug('Id "' + tag.tagId + '" of tag "' + tagName + '" saved on cache.')
				return tag;
			});
	}

	/**
	 * Create tag with this name in GetResponse
	 */
	transporter.createTag = function(tagName) {
		logger.debug('Creating tag "' + tagName + '"...')

		return Q.nfcall(request.post, {
				url: config.getResponse.baseUri + 'tags',
				headers: defaultHeaders,
				body: { name: tagName },
				json: true
			}).then(function(data) {
				var response = data[0];
				var body = data[1];
				if (response.statusCode >= 300)
					throw 'Can not create tag: ' + JSON.stringify(body);
			}).then(function() {
				return transporter.loadTag(tagName);
			});
	}


	/**
	 * Prepare tag ids
	 * @param tagNames [String] Tag names
	 */
	transporter.convertTagNamesOnTagIds = function(tagNames) {
		logger.debug('Converting tag name on tag id... tagNames: ' + JSON.stringify(tagNames))

		if (!tagNames || tagNames.length === 0)
			return [];

		// load tags id
		var promises = [];
		for(var key = 0; key < tagNames.length; key++) {
			promises.push(transporter.loadOrCreateTag(tagNames[key])
				.then(function(tag) {
					if (tag)
						return tag.tagId;
				}));
		}

		return Q.all(promises);
	}

	/*
	 * Load a contact related to the user profile.
	 */
	transporter.loadContact = function(email) {
		return function() {
			logger.debug('Loading contact on Get Response...')
			return Q.nfcall(request.get, {
					url: config.getResponse.baseUri + 'contacts?query[email]=' + email + '&query[campaignId]=' + config.getResponse.campainId,
					headers: defaultHeaders,
					json: true
				})
				.then(function(data) {
					var response = data[0];
					var body = data[1];
					if (response.statusCode >= 300)
						throw 'Can not found contact: ' + JSON.stringify(body);

					var contact = body[0];
					if (!contact || !contact.contactId)
						throw 'Can not found contact: ' + JSON.stringify(body);

					logger.debug('Contact founded by email "' + email + '" with id "' + contact.contactId + '".');
					return contact;
				});
		}
	}

	/*
	 * Create a contact related to the user profile.
	 */
	transporter.createContact = function(contact) {
		return function() {
			logger.debug('Creating contact on Get Response...')

			return Q.nfcall(request.post, {
					url: config.getResponse.baseUri + 'contacts',
					headers: defaultHeaders,
					body: contact,
					json: true
				})
				.then(function(data) {
					var response = data[0];
					var body = data[1];
					if (response.statusCode >= 300)
						throw JSON.stringify(body);
					logger.info('Contact created on Get Response.');
					return body[0];
				});
		}
	}

	/*
	 * Update contact related to the user profile.
	 */
	transporter.updateContact = function(contactInfoToUpdate) {
		return function(contact) {
			logger.debug('Updating contact on Get Response...')
			if (contact.name === contactInfoToUpdate.name)
				return contact;

			return Q.nfcall(request.post, {
					url: config.getResponse.baseUri + 'contacts/' + contact.contactId,
					headers: defaultHeaders,
					body: contactInfoToUpdate,
					json: true
				}).then(function(data) {
					var response = data[0];
					var body = data[1];
					if (response.statusCode >= 300)
						throw 'Can not updated contact because: ' + JSON.stringify(body);
					logger.info('Contact updated on Get Response.');
					return contact;
				});
		}
	}

	/*
	 * Update tags of a contact related to the user profile.
	 */
	transporter.updateTags = function(tags) {
		return function(contact) {
			logger.debug('Updating tags on Get Response...')

			var updateContact = {}
			updateContact.tags = [];
			return transporter.convertTagNamesOnTagIds(tags)
				.then(function(tagIds) {
					logger.debug('Adding tags on contact... ' + JSON.stringify(tagIds));
					for (var key = 0; key < tagIds.length; key++) {
						updateContact.tags[key] = { "tagId": tagIds[key] };
					}

					return Q.nfcall(request.post, {
							url: config.getResponse.baseUri + 'contacts/' + contact.contactId,
							headers: defaultHeaders,
							body: updateContact,
							json: true
						})
				})
				.then(function(data) {
					var response = data[0];
					var body = data[1];
					if (response.statusCode >= 300)
						throw 'Can not updated tags on contact because: ' + JSON.stringify(body);
					logger.info('Contact tags updated on Get Response.');
					return body;
				});
		}
	}
} else {
	logger.warn('This server can not comunicate with get response because apiKey/campainId is not configured.');
}

export default transporter;
