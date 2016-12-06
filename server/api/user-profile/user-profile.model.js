'use strict';

import mongoose from 'mongoose';
import Q from 'q';
import _ from 'lodash';
import * as brazilianInfos from 'brazilian-cities';

var UserProfileSchema = new mongoose.Schema({
	_id: { type: String, required: true }, // email
	state: {type: String, lowercase: true, enum: brazilianInfos.allStateCodes()},
	city: {type: String, lowercase: true, enum: brazilianInfos.allCityCodes()},
	name: { type: String },
	hasHealthPlan: { type: Boolean },
	healthPlan: {
		// operator: { type: String, trim: true, lowercase: true }, //, enum: ['amil', 'bradesco', 'central-nacional-unimed', 'saudesim', 'seguros-unimed', 'sulamerica']
		name: { type: String },
		number: { type: String },
	}
});

/**
 * Virtuals
 */

// email profile information
UserProfileSchema
    .virtual('email')
    .get(function() {
        return this._id;;
    })
	.set(function(email) {
        return this._id = email;
    });

/**
 * Methods
 */

UserProfileSchema.methods.merge = function(updates) {
    var updated = _.merge(this, updates);

	return updated;
}

export default mongoose.model('UserProfile', UserProfileSchema);
