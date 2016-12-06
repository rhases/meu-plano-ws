'use strict';

/**
 * This service is responsible to send push message about appointment's relevant modifications.
 */

import GcmPushMessageTransporter from '../../integrations/gcm-push-message.trasporter.js';
import moment from 'moment-timezone';
import * as medicalInfos from 'medical-specializations';
import * as authService from '../../authenticator/auth.service.js';

var logger = require('log4js').getLogger('notifier.appointment-to-push-message');

exports.notify = function(appointment) {
	return function() {
		if (!GcmPushMessageTransporter) {
			logger.warn('Can not send push message because GCM API KEY is not correctly configured.');
			return;
		}
		// console.log(appointment.status)
		if (appointment.status != "SCHEDULED")
			return;

		var messageParams = {
			data: {
				title: medicalInfos.getByCod(appointment.appointmentRequest.speciality).label + " agendado!",
				message: moment(appointment.when).locale("pt-br").format('LLLL') + "\n"
					+ "Dr(a). " + appointment.doctor.name,
				actions:
					[
					    { "icon": "ic_action_done_light", "title": "Aceitar", "callback": "app.pushListener.appointment.accept", "foreground": true},
					    { "icon": "ic_action_discard_light", "title": "Rejeitar", "callback": "app.pushListener.appointment.reject", "foreground": true},
					],
				summaryText: "Clínica " + appointment.clinic.name,
				notId: parseInt(appointment._id, 16) % 1000,
				appointmentId: appointment._id
			}

		};

		return authService.getUserInfomations(appointment.userProfile._id)
			.then(function(user) {
				if (!user || !user.appInfo || !user.appInfo.pushId) {
					console.log("Can not send message because this user don't have PUSH ID.")
					return;
				}

				console.log("Sending PUSH to " + user.email + " with PUSHID " + user.appInfo.pushId);
				// GcmPushMessageTransporter.sendMessage(messageParams, "fOabs9rxhC8:APA91bEI1SM4MTIa8bSbqkDNLRvqKSsUW-qg9Ny8c6Y6Py28T64hRpAYSddrcsGIKXySfCMjf_lq7m7jlzAjz0YiAYdA72GReAepKK-37SHClKi91fH_QkDO3T8wl9gAvDIWis_jja2s")
				GcmPushMessageTransporter.sendMessage(messageParams, user.appInfo.pushId);
			})
			.then(function() {
				logger.info('GCM push message sent.');
			})
	};
}
