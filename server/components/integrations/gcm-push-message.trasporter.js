'use strict';

/**
 * Integration of rhases and slack.
 */

import gcm from 'node-gcm';
import Q from 'q';
import _ from 'lodash';

import config from '../../config/environment';

var logger = require('log4js').getLogger('transporter.gcm-push-message');

var DEFAULT_MESSAGE_PARAMS = {
	data: {
		ledColor: [0, 0, 255, 0],
		//vibrationPattern: [2000, 1000, 500, 500],
		soundname: "default"
	}
}

var transporter;
if (config.gcm.apiKey) {
	var sender = new gcm.Sender(config.gcm.apiKey);

	transporter = {};
	transporter.sendMessage = function(messageParams, registrationToken) {
		return Q.Promise(function(resolve, reject) {
			messageParams = _.merge(DEFAULT_MESSAGE_PARAMS, messageParams);

			console.log(messageParams);

			sender.send(new gcm.Message(messageParams), { registrationTokens: [ registrationToken ] }, function (err, response) {
				if(err) reject(err);
				else    resolve(response);
			});
		})
	};
} else {
	logger.warn('This server can not communicate with Google Cloud Message because apiKey is not configured.');
}

export default transporter;
