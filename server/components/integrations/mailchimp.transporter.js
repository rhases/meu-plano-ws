'use strict';

/**
 * Integration of rhases and MailChimp.
 * API DOC: http://developer.mailchimp.com/documentation/mailchimp/reference
 */

import request from 'request';
import Q from 'q';

var logger = require('log4js').getLogger('transporter.mailchimp');

var md5 = require('js-md5');

import config from '../../config/environment';

var defaultHeaders = {
	'Authorization': 'api-key ' + config.mailChimp.apiKey
};

/**
 * Load all tags from MailChimp
 */
var tagCacheMap = {};
var loadAllTags = function() {
	logger.debug('Loading all tags ...')

	return Q.nfcall(request.get, {
			url: config.mailChimp.baseUri + 'lists/' + config.mailChimp.listId +
			'/interest-categories/' + config.mailChimp.tagsInterestCategoryId + '/interests?fields=interests.id,interests.name',
			headers: defaultHeaders,
			json: true
		}).then(function(data) {
			var response = data[0];
			var body = data[1];
			if (response.statusCode >= 300 || !body)
				throw 'Can not found tags: ' + JSON.stringify(body);
			return body;
		}).then(function(response) {
			var tags = response.interests;
			if(!tags) {
				throw 'Can not found tags: interests is empty!';
			}

			for(var i in tags) {
				var tag = tags[i]
				logger.info('Tag "' + tag.name + '" loaded.')
				tagCacheMap[tag.name] = tag;  // add on cache
				logger.debug('Id "' + tag.id + '" of tag "' + tag.name + '" saved on cache.')
			}
			return tags;
		});
}

/**
 * Load a tag with this name from Cache
 */
var loadTagFromCache = function(tagName) {
	logger.debug('Loading tag from cache "' + tagName + '"...')
	var deferred = Q.defer();
	if (tagCacheMap[tagName]) {
		logger.debug('Tag "' + tagName + '" in cache.')
		deferred.resolve(tagCacheMap[tagName]);
	} else {
		deferred.reject('Tag "' + tagName + '" not found.');
	}
	return deferred.promise;
}

/**
 * Create tag with this name in MailChimp
 */
var createTag = function(tagName) {
	logger.debug('Creating tag "' + tagName + '"...')

	return Q.nfcall(request.post, {
			url: config.mailChimp.baseUri + 'lists/' + config.mailChimp.listId + '/interest-categories/' + config.mailChimp.tagsInterestCategoryId + '/interests',
			headers: defaultHeaders,
			body: { name: tagName },
			json: true
		}).then(function(data) {
			var response = data[0];
			var body = data[1];
			if (response.statusCode >= 300)
				throw 'Can not create tag: ' + JSON.stringify(body);
			return body;
		}).then(function(tag) {
			logger.info('Tag "' + tag.name + '" created.')
			tagCacheMap[tag.name] = tag;  // add on cache
			logger.debug('Id "' + tag.id + '" of tag "' + tag.name + '" saved on cache.')
			return tag;
		});
}

/**
 * Find tag on cache or create a tag with this name.
 */
var loadOrCreateTag = function(tagName) {
	// Load the id of tag from MailChimp
	return loadTagFromCache(tagName)
		.catch(function(err) {
			// Create tag with this name
			return createTag(tagName)
				.then(function(tag) {
					logger.info('Tag "' + tagName + '" created.')
					return tag;
				});
		});
}

var transporter;
if (config.mailChimp.apiKey && config.mailChimp.listId && config.mailChimp.tagsInterestCategoryId) {
	transporter = {};

	// Load all tags in cache
	loadAllTags()
	.then(function (tags) { // Contact created
		logger.info("Tags loaded: " + JSON.stringify(tags));
	})
	.catch(function(err) { // Contact not created (probably because already exist)
		logger.warn("Can not load tags: " + err);
	});

	/**
	 * Prepare tag ids
	 * @param tagNames [String] Tag names
	 */
	transporter.putTagsIntoContact = function(contact, tagNames) {
		logger.debug('Converting tag name on tag id... tagNames: ' + JSON.stringify(tagNames))

		if (!tagNames || tagNames.length == 0)
			return [];

		// load tags id
		var promises = [];
		for(var key = 0; key < tagNames.length; key++) {
			promises.push(loadOrCreateTag(tagNames[key])
				.then(function(tag) {
					if (tag)
						return tag.id;
				}));
		}

		return Q.all(promises)
		.then(function(tagIds) {
			logger.debug('Adding tags on contact... ' + JSON.stringify(tagIds));
			contact.interests = {};
			for (var key = 0; key < tagIds.length; key++) {
				contact.interests[tagIds[key]] = true;
			}
			logger.debug('Tags added: ' + JSON.stringify(contact));
		});
	}

	/*
	 * Create or update a contact related to the user profile.
	 */
	transporter.saveContact = function(contact) {
		return function() {

			//contact.email_address = contact.email_address.trim().toLowerCase();
			logger.debug('Contact to save: ' + JSON.stringify(contact));
			var subscriberHash = md5(contact.email_address);

			logger.debug('Saving ' + contact.email_address + ':' + subscriberHash + ' on MailChimp...')
			logger.debug('Contact ' + JSON.stringify(contact));
			return Q.nfcall(request.put, {
					url: config.mailChimp.baseUri + 'lists/' + config.mailChimp.listId + '/members/' + subscriberHash,
					headers: defaultHeaders,
					body: contact,
					json: true
				})
				.then(function(data) {
					var response = data[0];
					var body = data[1];
					if (response.statusCode >= 300)
						throw JSON.stringify(body);
					logger.info('Contact saved on MailChimp.');
					return body;
				});
		}
	}
} else {
	logger.warn('This server can not comunicate with MailChimp because apiKey/listId/tagsInterestCategoryId is not configured.');
}

export default transporter;
