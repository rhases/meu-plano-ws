'use strict';

import mongoose from 'mongoose';
import Q from 'q';
import _ from 'lodash';

var ProcedureSchema = new mongoose.Schema({
	_id: { type: Number, required: true }, //ANS Cod
	mainDescription: String,
	coverageTypes: [ { type: String, enum: [ 'ambulatorial', 'hospitalar', 'obstetricia', 'odontologico' ] } ],
	descriptions: [ { type: String } ], // usado para buscar
}, { timestamps: true });

export default mongoose.model('Procedure', ProcedureSchema);
