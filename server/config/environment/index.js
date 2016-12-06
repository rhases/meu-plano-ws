'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // MongoDB connection options
  mongo: {
      options: {
          db: {
              safe: true
          }
      }
  },

	// MailChimp Integration
	mailChimp: {
		// URL FORMAT: https://<dc>.api.mailchimp.com/3.0/
		// The <dc> part of the URL corresponds to the data center for your account.
		// For example, if the last part of your MailChimp API key is us6,
		// all API endpoints for your account are available at https://us6.api.mailchimp.com/3.0/.
		baseUri: 'https://' + process.env.MAILCHIMP_DC + '.api.mailchimp.com/3.0/',
		apiKey: process.env.MAILCHIMP_API_KEY,
		listId: process.env.MAILCHIMP_LIST_ID,
		// The interest_category_id of the hidden 'Tags' interest (Groups in Mailchimp UI)
		tagsInterestCategoryId: process.env.MAILCHIMP_TAGS_INTEREST_CATEGORY_ID
	},

  // Get Response Integration
  getResponse: {
    baseUri: 'https://api.getresponse.com/v3/',
    apiKey: process.env.GETRESPONSE_API_KEY,
    campainId: process.env.GETRESPONSE_CAMPAIN_ID,
  },
	// Slack Integration
	slack: {
		webhookUrl: process.env.SLACK_WEBHOOK_URL,
	},

	// Google Cloud Message Integration
	gcm: {
		apiKey: process.env.GCM_API_KEY,
	},

	// Rhases Authenticator
	authenticator: {
		uri: process.env.AUTHENTICATOR_URI || "http://auth.api.rhases.com.br/api/users"
	}

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./shared'),
    require('./' + process.env.NODE_ENV + '.js') || {});
