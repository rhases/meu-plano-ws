'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
	GCM_API_KEY: 'AIzaSyBfjfTXOKrYLOuIfhHmGmIUEnewLUTjvCU',

	// Control debug level for modules using visionmedia/debug
	DEBUG: '',

	//MONGODB_URI: 'mongodb://localhost/ans-ws-dev'
	MONGODB_URI: 'mongodb://heroku_0jwz32f2:t60kjq7pq5noj00fjm0atcel0q@ds127878.mlab.com:27878/heroku_0jwz32f2'
};
