'use strict';

import mongoose from 'mongoose';
import _ from 'lodash';

import Q from 'q';

var HealthPlanIdSchema = new mongoose.Schema({
	cod: { type: String, required: true, index: true },
	operator: { type: String, required: true, index: true }
});

export default HealthPlanIdSchema;
