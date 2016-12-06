'use strict';

/**
 * Integration of rhases and slack.
 */

import request from 'request';
import Q from 'q';

import config from '../../config/environment';

var logger = require('log4js').getLogger('transporter.slack');

var transporter;
if (config.slack.webhookUrl) {
	transporter = {};
	transporter.sendMessage = function(payload) {
		return Q.nfcall(request.post, {
				url: config.slack.webhookUrl,
				form: { payload: JSON.stringify(payload) }
			})
			.then(function(data) {
				var response = data[0];
				var body = data[1];
				if (response.statusCode >= 300)
					throw 'Can not send slack message. Reason: ' + JSON.stringify(body);
				return body[0];
			})
	};
} else {
	logger.warn('This server can not send slack message because webhookUrl is not configured.');
}

export default transporter;
