'use strict';

import mongoose from 'mongoose';
import _ from 'lodash';

import Q from 'q';

var HealthPlanSchema = new mongoose.Schema({
	_id: { type: Number, required: true }, //ANS Cod
	name: { type: String, required: true },
	status: String, /*Comercializacao: suspensa, ativa com comercialização suspensa, liberada*/

	Procedure:  { type: mongoose.Schema.Types.Number, ref: 'Procedure' },

	coverageTypes: [String], /*ambulatorial, hospitalar, odonto ... TODO: enum*/
	accomodation:String, /*s/acomodacao, coletivo, indiv */
	moderatorFactor: Boolean, /*coopart*/
	contractType:String,/*indiv, ce, ca*/

	coverageAreaType: String, /*abrangencia geografica TODO: enum [Nacional, Estadual, Municipal, Grupo de Estados, Grupo de Municipios]*/
	coverageArea: [{ // this is a include. if
		state: String,
		cities: [ String ]
	}],

	maxPrice:{
		a18orLess: { type: Number, required: true},
		a19to23: { type: Number, required: true},
		a24to28: { type: Number, required: true},
		a29to33: { type: Number, required: true},
		a34to38: { type: Number, required: true},
		a39to43: { type: Number, required: true},
		a44to48: { type: Number, required: true},
		a49to53: { type: Number, required: true},
		a54to58: { type: Number, required: true},
		a59orMore: { type: Number, required: true},
	}
});

/**
 * Methods
 */

HealthPlanSchema.methods.populate = function() {
	var deferred = Q.defer();
	var healthPlan = this;

	if (healthPlan.Procedure._id) {
		deferred.resolve(healthPlan);
	} else {
		mongoose.model('Procedure').findById(healthPlan.Procedure).exec()
			.then(function(Procedure) {
				if (Procedure && Procedure != null)
					healthPlan.Procedure = Procedure;

				deferred.resolve(healthPlan);
			})
			.error(function(err) {
				deferred.reject(new Error(err));
			});
	}

	return deferred.promise;
}

HealthPlanSchema.methods.merge = function(updates) {
    var updated = _.merge(this, updates);

	// List workaround (without it the list is not updated)
    if (updates.rhasesExtras)
		this.markModified('rhasesExtras');
    if (updates.planTables)
		this.markModified('planTables');
    if (updates.restrictions && updates.restrictions.geographic)
		this.markModified('restrictions.geographic');

	return updated;
}

export default mongoose.model('HealthPlan', HealthPlanSchema);
