var procedimentos = db.ans_procedimentos.find();

procedimentos.forEach(function(procedimento){

	var setUnion = function(orig, dest){
		for(index in orig){
			if(!(dest.indexOf(orig[index])>=0)){
				dest.push(orig[index]);
			}
		}
	};
	var procedure = {};
	procedure._id = NumberInt(procedimento.idProcedimentoROL);
	procedure.mainDescription = procedimento.descricaoProcedimentoROL;

	procedure.coverageTypes=[];
	if(procedimento.procedimentoOdonto){
		procedure.coverageTypes.push("odontologico");
	}
	if(procedimento.procedimentoAmbul){
		procedure.coverageTypes.push("ambululatorial");
	}
	if(procedimento.procedimentoApac){
		procedure.coverageTypes.push("apac");
	}
	if(procedimento.procedimentoComObst){
		procedure.coverageTypes.push("obstetricia");
	}
	if(procedimento.procedimentoSemObst){
		procedure.coverageTypes.push("hospitalar");
	}
	procedure.descriptions = [];
	procedure.descriptions.push(procedimento.descricaoProcedimentoROL);
	setUnion(procedimento.descricoesProcedimentosTUSS, procedure.descriptions);
	setUnion(procedimento.descricoesTermosROL, procedure.descriptions);

	db.procedures.update({"_id":procedure._id}, procedure, true);

})
