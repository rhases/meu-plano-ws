'use strict';

import mongoose from 'mongoose';
import _ from 'lodash';

import Q from 'q';

var HealthPlanSchema = new mongoose.Schema({
	_id: { type: Number, required: true }, //ANS Cod
	name: { type: String, required: true },
	status: { type: String, enum: [ 'suspenso', 'ativo-comercializacao-suspensa', 'liberado' ], required: true }, /*Comercializacao: suspensa, ativa com comercialização suspensa, liberada*/

	operator:  { type: mongoose.Schema.Types.Number, ref: 'Operator' },

	coverageTypes: [ { type: String, enum: [ 'ambulatorial', 'hospitalar', 'obstetricia', 'odontologico' ] }],
	accomodation: { type: String, enum: [ 'individual', 'coletiva' ] }, /* s/acomodacao, coletivo, indiv */
	moderatorFactor: Boolean, /* coopart */
	contractType: { type: String, enum: [ 'individual', 'coletivo-empresarial', 'coletivo-adesao' ] }, /* indiv, ce, ca */

	coverageAreaType: { type: String, enum: [ 'nacional', 'estadual', 'municipal', 'grupo-de-estados', 'grupo-de-municipios' ], /*abrangencia geografica TODO: enum [Nacional, Estadual, Municipal, Grupo de Estados, Grupo de Municipios]*/
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

	if (healthPlan.Operator._id) {
		deferred.resolve(healthPlan);
	} else {
		mongoose.model('operator').findById(healthPlan.Operator).exec()
			.then(function(Procedure) {
				if (Operator && Operator != null)
					healthPlan.Operator = Operator;

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
