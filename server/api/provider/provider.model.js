'use strict';

import mongoose from 'mongoose';
import * as medicalInfos from 'medical-specializations';
import * as schedulerInfos from 'scheduler-utils';

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

var ProviderSchema = new mongoose.Schema({
	_id: {type:Number}, // cnes
	name: { type: String, required: true },
	image: { type: String }, // link to a image
	address:  AddressSchema,
	phone:  { type: String, required: true },
	rate: Number,
	Procedures: [{ type: mongoose.Schema.Types.Number, ref: 'Procedure' }],
	healthPlans: [{
		services: [{type: String}], /*H, M, PS, A*/
		medicalSpecialties:[], //consultas médicas
		procedures: [],
		plan: { type: mongoose.Schema.Types.Number, ref: 'HealthPlan' }
	}],

},{ autoIndex: true, toObject: { virtuals: true }, toJSON: { virtuals: true }});

export default mongoose.model('Provider', ProviderSchema);
