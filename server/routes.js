/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import config from './config/environment';

export default function(app) {
    // Insert routes below
    app.use('/api/health-plan', require('./api/health-plan'));
    app.use('/api/Procedure', require('./api/Procedure'));
    app.use('/api/procedure', require('./api/procedure'));
    app.use('/api/provider', require('./api/provider'));
    app.use('/api/user-profiles', require('./api/user-profile'));
    // All other routes should redirect to the index.html
    //app.route('/*').get(errors[404]);
}
