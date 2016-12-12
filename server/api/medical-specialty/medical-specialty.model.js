'use strict';

import mongoose from 'mongoose';
import Q from 'q';
import _ from 'lodash';

var MedicalSpecialtySchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	name: String,
}, { timestamps: true });

export default mongoose.model('MedicalSpecialty', MedicalSpecialtySchema);
