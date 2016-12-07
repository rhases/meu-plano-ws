'use strict';

// Production specific configuration
// =================================
module.exports = {
	// Server IP
	ip:     process.env.OPENSHIFT_NODEJS_IP ||
	      process.env.IP ||
	      undefined,

	// Server port
	port:   process.env.OPENSHIFT_NODEJS_PORT ||
	      process.env.PORT ||
	      8080,

	// MongoDB connection options
	mongo: {
	uri:  process.env.MONGODB_URI ||
					process.env.MONGOLAB_URI ||
	      process.env.MONGOHQ_URL ||
	      process.env.OPENSHIFT_MONGODB_DB_URL +
	      process.env.OPENSHIFT_APP_NAME
	},
	// MailChimp Integration
	mailChimp: {
		listId: process.env.MAILCHIMP_LIST_ID || '6129fcb545',
		tagsInterestCategoryId: process.env.MAILCHIMP_TAGS_INTEREST_CATEGORY_ID || 'e9b4493a09'
	}

};
