'use strict';

import mongoose from 'mongoose';
import _ from 'lodash';

import Q from 'q';

var HealthPlanIdSchema = new mongoose.Schema({
	cod: { type: String, required: true, index: true },
	operator: { type: mongoose.Schema.Types.Number, ref: 'Operator', required: true, index: true }
}, { _id: false });

export default HealthPlanIdSchema;
