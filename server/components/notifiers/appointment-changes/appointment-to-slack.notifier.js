'use strict';

/**
 * This service is responsible to notify slack about proposal's relevant modifications.
 */

import SlackTransporter from '../../integrations/slack.transporter.js';
import moment from 'moment';

import * as medicalInfos from 'medical-specializations';
import * as schedulerInfos from 'scheduler-utils';
import * as authService from '../../authenticator/auth.service.js';

var logger = require('log4js').getLogger('notifier.appointment-to-slack');

function getAcceptedPayload(appointment, user) {
	var specialityLabel = medicalInfos.getByCod(appointment.doctor.speciality).label;
	return {
		"attachments": [
			{
				"fallback": user.name + " aceitou o " + specialityLabel + ".",
				"pretext": "*" + user.name + "* aceitou o *" + specialityLabel + "*.",
				"title": user.name + " - " + specialityLabel,
				"text": specialityLabel + " para " + moment(appointment.when).locale("pt-br").format('LLLL') + " aceitado!",
				"footer": "Consulta " + appointment._id,
				"mrkdwn_in": ["text", "pretext"],
				"color": 'good'
			}
		]
	};
}

function getRefusedPayload(appointment, user) {
	var specialityLabel = medicalInfos.getByCod(appointment.doctor.speciality).label;
	return {
		"attachments": [
			{
				"fallback": user.name + " não aceitou o " + specialityLabel + ".",
				"pretext": "*" + user.name + " NÃO* aceitou o *" + specialityLabel + "*.",
				"title": user.name + " - " + specialityLabel,
				"text": specialityLabel + " para " + moment(appointment.when).locale("pt-br").format('LLLL') + " recusado! \n"
					+ "*Motivo:* '" + appointment.comment + "'\n"
					+ "_Ligue para a clínica " + appointment.clinic.name + " e comunique._",
				"footer": "Consulta " + appointment._id,
				"mrkdwn_in": ["text", "pretext"],
				"color": 'danger'
			}
		]
	};
}

function getConfirmedPayload(appointment, user) {
	var specialityLabel = medicalInfos.getByCod(appointment.doctor.speciality).label;
	return {
		"attachments": [
			{
				"fallback": user.name + " confirmou a ida ao " + specialityLabel + ".",
				"pretext": "*" + user.name + "* confirmou a ida ao *" + specialityLabel + "*.",
				"title": user.name + " - " + specialityLabel,
				"text": specialityLabel + " para " + moment(appointment.when).locale("pt-br").format('LLLL') + " confirmado!",
				"footer": "Consulta " + appointment._id,
				"mrkdwn_in": ["text", "pretext"],
				"color": 'good'
			}
		]
	};
}

function getCanceledPayload(appointment, user) {
	var specialityLabel = medicalInfos.getByCod(appointment.doctor.speciality).label;
	return {
		"attachments": [
			{
				"fallback": user.name + " desmarcou o " + specialityLabel + ".",
				"pretext": "*" + user.name + " DESMARCOU* aceitou o *" + specialityLabel + "*.",
				"title": user.name + " - " + specialityLabel,
				"text": specialityLabel + " para " + moment(appointment.when).locale("pt-br").format('LLLL') + " desmarcado! \n"
					+ "*Motivo:* '" + appointment.comment + "'\n"
					+ "_Ligue para a clínica " + appointment.clinic.name + " e comunique._",
				"footer": "Consulta " + appointment._id,
				"mrkdwn_in": ["text", "pretext"],
				"color": 'danger'
			}
		]
	};
}

exports.notify = function(appointment) {
	return function() {
		if (!SlackTransporter) {
			logger.warn('Can not send message because slack web hook url is not correctly configured.');
			return;
		}
		if (appointment.status == "SCHEDULED")
			return;

		var userEmail;
		if (appointment.userProfile && appointment.userProfile._id)
			userEmail = appointment.userProfile._id;
		else
			userEmail = appointment.userProfile;

		return authService.getUserInfomations(userEmail)
			.then(function(user) {
				var payload;

				if (appointment.status == "ACCEPTED") {
					payload = getAcceptedPayload(appointment, user);
				} else if (appointment.status == "REFUSED") {
					payload = getRefusedPayload(appointment, user);
				} else if (appointment.status == "CONFIRMED") {
					payload = getConfirmedPayload(appointment, user);
				} else if (appointment.status == "CANCELED") {
					payload = getCanceledPayload(appointment, user);
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
