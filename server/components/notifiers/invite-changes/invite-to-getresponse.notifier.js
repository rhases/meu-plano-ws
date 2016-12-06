'use strict';

/**
 * This service is responsible to notify get response about user profile's relevant modifications.
 * API DOC: http://apidocs.getresponse.com/pl/v3/resources/contacts
 */

import config from '../../../config/environment';
import Q from 'q';

import getResponseTransporter from '../../integrations/getresponse.transporter.js';

var logger = require('log4js').getLogger();

export default function(invite) {

	return function() {
		if (!getResponseTransporter) {
			logger.warn('Can not send notification to GetResponse because API KEY is not correctly configured.');
			return;
		}

		var contactInfoToCreate = {}
		contactInfoToCreate.name = invite.name;
		contactInfoToCreate.email = invite.email;
		contactInfoToCreate.campaign = {}
		contactInfoToCreate.campaign.campaignId = config.getResponse.campainId;

		return Q.fcall(getResponseTransporter.createContact(contactInfoToCreate)) // Try create this contact
			.then(function () { // Contact created
				return Q.delay(10000) // Need because when create a contact the GetResponse has a delay to list it
					.then(getResponseTransporter.loadContact(invite.email)) // Load contact from get response (needed because create return nothing)
					.then(getResponseTransporter.updateTags(invite.tags)); // Only update tags of contact (create can not send tags)
			})
			.catch(function(err) { // Contact not created (probably because already exist)
				logger.info("Can not create contact. (probably because already exist): " + err);

				var contactInfoToUpdate = {}
				contactInfoToUpdate.name = invite.name;

				return Q.fcall(getResponseTransporter.loadContact(invite.email)) // Load contact from get response (needed to discovery the id of contact)
					.then(getResponseTransporter.updateContact(contactInfoToUpdate)) // Only update name of contact
					.then(getResponseTransporter.updateTags(invite.tags)); // Only update tags of contact
			});
	}
}
