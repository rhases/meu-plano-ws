'use strict';

// Development specific configuration
// ==================================
module.exports = {

	// MongoDB connection options
	mongo: {
		uri: 'mongodb://localhost/ans-ws-dev'
	},

	port: 9002,

	// Seed database on startup
	seedDB: false,

	byPassAuthenticator: false

};
