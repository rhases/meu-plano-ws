'use strict';

import mongoose from 'mongoose';
import Q from 'q';
import _ from 'lodash';

var NetworkRequestSchema = new mongoose.Schema({
	user: { type: String, required: true },

	medicalSpecialty: { type: Number },
	procedure: { type: Number },

	comment: { type: String },

	status: { type: String, enum: [ 'new', 'answered' ] } // new, answered
}, { timestamps: true });

export default mongoose.model('NetworkRequest', NetworkRequestSchema);
