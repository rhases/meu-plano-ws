'use strict';

/**
 * This service is responsible to notify MailChimp about user profile's relevant modifications.
 */

import config from '../../../config/environment';
import Q from 'q';

import mailChimpTransporter from '../../integrations/mailchimp.transporter.js';

var logger = require('log4js').getLogger();

exports.notify = function(invite) {

	return function() {
		if (!mailChimpTransporter) {
			logger.warn('Can not send notification to MailChimp because API KEY is not correctly configured.');
			return;
		}

		var contactInfo = {}
		contactInfo.email_address = invite.email;
		contactInfo.status = "subscribed";
		contactInfo.status_if_new = "subscribed";
		contactInfo.merge_fields = {}
		contactInfo.merge_fields.NAME = invite.name;

		return mailChimpTransporter.putTagsIntoContact(contactInfo, invite.tags)
			.then(mailChimpTransporter.saveContact(contactInfo)) // Try create this contact
			.catch(function(err) { // Contact not created (probably because already exist)
				logger.info("Can not create or update contact: " + err);
			});
	}

}
