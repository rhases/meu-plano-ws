'use strict';

/**
 * This service is responsible to notify slack about proposal's relevant modifications.
 */

import SlackTransporter from '../../integrations/slack.transporter.js';

import * as medicalInfos from 'medical-specializations';
import * as schedulerInfos from 'scheduler-utils';
import * as authService from '../../authenticator/auth.service.js';

var logger = require('log4js').getLogger('notifier.appointment-request-to-slack');

function getText(appointmentRequest, user) {
	var text = '';
	// text += '*Nome:* ' + user.name + '\n';
	text += '*Email:* ' + appointmentRequest.userProfile.email + '\n';
	if (user.phone)
		text += '*Telefones:* ' + user.phone + "\n";
	text += '*Mora em:* ' + appointmentRequest.userProfile.city + " - " + appointmentRequest.userProfile.state + '\n';
	text += '*Plano de saúde:* ' + appointmentRequest.userProfile.healthPlan.name + " - " + appointmentRequest.userProfile.healthPlan.number + '\n';

	text += '\n\n';

	text += '*Especialidade:* ' + medicalInfos.getByCod(appointmentRequest.speciality).label + '\n';
	text += '*Dia da semana:* ' + appointmentRequest.weekday.map(function(weekdayCod) { return schedulerInfos.getWeekdayByCod(weekdayCod).label }).join(', ') + '\n';
	text += '*Período:* ' + appointmentRequest.timerange.map(function(timerangeCod) { return schedulerInfos.getPeriodByCod(timerangeCod).label }).join(', ') + '\n';
	if (appointmentRequest.area)
		text += '*Região:* ' + appointmentRequest.area.join(', ') + '\n';

	if (appointmentRequest.comment)
		text += '\n*Comentários:* ' + appointmentRequest.comment;

	return text;
}

exports.notify = function(appointmentRequest) {
	return function() {
		if (!SlackTransporter) {
			logger.warn('Can not send message because slack web hook url is not correctly configured.');
			return;
		}

		var userEmail;
		if (appointmentRequest.userProfile && appointmentRequest.userProfile._id)
			userEmail = appointmentRequest.userProfile._id;
		else
			userEmail = appointmentRequest.userProfile;

		return authService.getUserInfomations(userEmail)
			.then(function(user) {
				var payload;
				if (appointmentRequest.status == "NEW") {
					payload = {
						"attachments": [
							{
								"fallback": user.name + " quer uma consulta.",
								"pretext": "*" + user.name + "* quer uma consulta.",
								"title": user.name,
								"text": getText(appointmentRequest, user),
								"footer": "Requisição " + appointmentRequest._id,
								"mrkdwn_in": ["text", "pretext"]
							}
						]
					};
				} else if (appointmentRequest.status == "CANCELED") {
					payload = {
						"attachments": [
							{
								"fallback": user.name + " cancelou seu pedido de consulta.",
								"pretext": "*" + user.name + "* cancelou seu pedido de consulta.",
								"title": user.name,
								"text": "Pedido de consulta com " + medicalInfos.getByCod(appointmentRequest.speciality).label + " cancelado.",
								"footer": "Requisição " + appointmentRequest._id,
								"mrkdwn_in": ["text", "pretext"],
								"color": 'danger'
							}
						]
					};
				} else {
					return;
				}


				return SlackTransporter.sendMessage(payload)
					.then(function() {
						logger.info('Slack message sent.');
					});
			});
	};
}
