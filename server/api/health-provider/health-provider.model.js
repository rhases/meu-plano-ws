'use strict';

import mongoose from 'mongoose';
import HealthPlanIdSchema from '../health-plan/health-plan-id.schema';


var AddressSchema = new mongoose.Schema({
	label: { type: String, required: true },
	name: { type: String, required: true },
	state: { type: String, lowercase: true, trim: true, required: true },
	city: { type: String, lowercase: true, trim: true, required: true },
	area: { type: String, lowercase: true, trim: true, required: true },
	address: { type: String, trim: true},
	zip:  { type: String, trim: true},
	phones: [{ type: String, trim: true }],
}, { _id: false });

var HealthProviderSchema = new mongoose.Schema({
	_id: {type:Number}, // cnes

	name: { type: String, required: true },

	legalName: { type: String, required: true },
	cnpj: { type: String, required: true },
	geo: {
        latitude: String,
        longitude: String
    },
	address:  AddressSchema,

	type: { type: String, required: true },

	image: { type: String }, // link to a image
	phone:  { type: String },

	rate: Number,

	procedures: [{ type: mongoose.Schema.Types.Number, ref: 'Procedure' }],
	healthPlans: [{
		services: [{type: String, enum: [ 'hospitalar', 'ambulatorial', 'pronto-socorro', 'maternidade' ] }], /*H, M, PS, A*/
		medicalSpecialties: [], //consultas médicas
		procedures: [],
		plan: { type: HealthPlanIdSchema, ref: 'HealthPlan' }
	}],

}, { autoIndex: true, toObject: { virtuals: true }, toJSON: { virtuals: true }});

export default mongoose.model('HealthProvider', HealthProviderSchema);
