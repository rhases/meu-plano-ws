/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import config from './config/environment';

export default function(app) {
    // Insert routes below
    app.use('/api/health-plans', require('./api/health-plan'));
	app.use('/api/health-providers', require('./api/health-provider'));
	app.use('/api/medical-specialties', require('./api/medical-specialty'));
	app.use('/api/network-requests', require('./api/network-request'));
    app.use('/api/operators', require('./api/operator'));
    app.use('/api/procedures', require('./api/procedure'));
    app.use('/api/user-profiles', require('./api/user-profile'));
    // All other routes should redirect to the index.html
    //app.route('/*').get(errors[404]);
}
