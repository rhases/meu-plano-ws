'use strict';

import mongoose from 'mongoose';
import Q from 'q';
import _ from 'lodash';

var ProcedureSchema = new mongoose.Schema({
	_id: { type: String, required: true }, //ANS Cod
	mainDescription:String,
	coverageTypes:[], // ondonto, ambul, apac, obst TODO: enum*/
	descriptions:[ { type: String } ], // usado para buscar
}, { timestamps: true });

export default mongoose.model('Procedure', ProcedureSchema);
