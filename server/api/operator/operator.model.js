'use strict';

import mongoose from 'mongoose';
import _ from 'lodash';

var ProcedureSchema = new mongoose.Schema({
	_id: { type: Number, required: true }, //ANS Cod
	name: { type: String, required: true },
	image: String, // link to a image of this plan
	ansQualification: Number,
	legalName: String,
	numberOfClients: Number,
	numberOfComplaints: Number,
	healthPlans : [{ type: mongoose.Schema.Types.Number, ref: 'HealthPlan' }]
});

/**
 * Methods
 */

ProcedureSchema.methods.merge = function(updates) {
    var updated = _.merge(this, updates);

	// List workaround (without it the list is not updated)
    if (updates.healthPlans)
		this.markModified('healthPlans');

	return updated;
}

export default mongoose.model('Procedure', ProcedureSchema);
