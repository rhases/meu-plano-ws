'use strict';

// Development specific configuration
// ==================================
module.exports = {

	// MongoDB connection options
	mongo: {
		// uri: 'mongodb://localhost/ans-ws-dev'
		uri: 'mongodb://heroku_0jwz32f2:t60kjq7pq5noj00fjm0atcel0q@ds127878.mlab.com:27878/heroku_0jwz32f2'
	},

	port: 9002,

	// Seed database on startup
	seedDB: false,

	byPassAuthenticator: false

};
