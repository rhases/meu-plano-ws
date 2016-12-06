'use strict';

/**
 * This service is responsible to notify slack about proposal's relevant modifications.
 */

import SlackTransporter from '../../integrations/slack.transporter.js';

var logger = require('log4js').getLogger('notifier.invite-to-slack');

function getText(invite) {
	var text = '';
	// text += '*Nome:* ' + user.name + '\n';
	text += '*Nome:* ' + invite.name + '\n';
	if (invite.phone)
		text += '*Telefones:* ' + invite.phone + '\n';
	text += '*Plano de saúde:* ' + invite.healthIssurance +  '\n';
	text += '*Tags:* ' + JSON.stringify(invite.tags) +  '\n';
	text += '*Recomendado Por:* ' + JSON.stringify(invite.recommendedBy) +  '\n';

	text += '\n\n';

	return text;
}

exports.notify = function(invite) {
	return function() {
		if (!SlackTransporter) {
			logger.warn('Can not send message because slack web hook url is not correctly configured.');
			return;
		}

		var payload;
		var status  = InviteUtils.inviteAuthStatus(invite);
		if (status == 'invite_requested') {
			payload = {
				'attachments': [
					{
						'fallback': invite.name + ' solicitou convite.',
						'pretext': '*' + invite.name + '* solicitou convite.',
						'title': invite.name,
						'text': getText(invite),
						'footer': 'convite  ' + invite._id,
						'mrkdwn_in': ['text', 'pretext']
					}
				]
			};
		} else if (status == 'invited') {
			payload = {
				'attachments': [
					{
						'fallback': invite.name + ' convidado.',
						'pretext': '*' + invite.name + '* convidado.',
						'title': invite.name,
						'text': getText(invite),
						'footer': 'convite  ' + invite._id,
						'mrkdwn_in': ['text', 'pretext']
					}
				]
			}
		} else if (status == 'registered') {
			payload = {
				'attachments': [
					{
						'fallback': invite.name + ' registrou.',
						'pretext': '*' + invite.name + '* registrou.',
						'title': invite.name,
						'text': getText(invite),
						'footer': 'convite  ' + invite._id,
						'mrkdwn_in': ['text', 'pretext']
					}
				]
			};
		}

		return SlackTransporter.sendMessage(payload)
			.then(function() {
				logger.info('Slack message sent.');
			})
			.catch(function(err){
				logger.error('error sending slack message:' + err);
			});
	}
}
