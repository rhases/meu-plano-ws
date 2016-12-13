//
//
//var operadoras = db.ans_cadastro_operadoras.find();
//
//operadoras.forEach(function(operadora){
//
//	var operator = {};
//	
//	if( operadora["Nome Fantasia"] == null ){
//		operator.name = operadora["Razão Social"];
//		print(operator.name);
//	}else{
//		operator.name = operadora["Nome Fantasia"];
//	}
//	operator.legalName = operadora["Razão Social"];
//	db.operators_test.update({"_id": NumberInt(operadora["Registro ANS"])}, operator, true);
//
//});
//
//var qualiOperadoras = db.ans_qualificacao_operadoras.find();
//
//var operadoras = qualiOperadoras.forEach(function(operadora){
//	db.operators_test.update({"_id":NumberInt(operadora.Reg_ANS)},{$set : {"ansQualification":operadora.IDSS}});
//
//});
//

var rsOperadoras = db.hi_seller_operators.find();

var operadoras = rsOperadoras.forEach(function(operadora){
  if(operadora.ans_code != null ){
    print(operadora.ans_code);
	db.operators_test.update({"_id":NumberInt(operadora.ans_code.replace("-",""))},{$set : {"image":operadora.image}});
  }

});