'use strict';

// Test specific configuration
// ===========================
module.exports = {
	// MongoDB connection options
	mongo: {
		uri: 'mongodb://localhost/scheduler-ws-test'
	},
	seedDB: true,
	
	byPassAuthenticator: true

};
