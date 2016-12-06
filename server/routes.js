/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import config from './config/environment';

export default function(app) {
    // Insert routes below
    app.use('/api/doctors', require('./api/doctor'));
    app.use('/api/providers', require('./api/provider'));
    app.use('/api/user-profiles', require('./api/user-profile'));
    app.use('/api/appointments', require('./api/appointment'));
    app.use('/api/appointment-requests', require('./api/appointment-request'));
    app.use('/api/invites', require('./api/invite'));

    // All other routes should redirect to the index.html
    //app.route('/*').get(errors[404]);
}
