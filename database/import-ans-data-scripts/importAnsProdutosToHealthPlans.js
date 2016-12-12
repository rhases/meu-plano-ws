var produtos = db.ans_produtos.find({ $and: [ { "COMERCIALIZACAO": "Liberada" }, { "ABRANGENCIA_GEOGRAFICA": "Nacional" } ] }).noCursorTimeout();

contractTypes = {
		"Individual ou familiar" : "individual",
		"Coletivo empresarial" : "coletivo-empresarial",
		"Coletivo por adesão" : "coletivo-adesao",
		"Coletivo Empresarial + Coletivo por Adesão" : "coletivo-adesao-ou-empresarial",
		"Individual + Coletivo Empresarial + Coletivo por Adesão" : "todos"
};

produtos.forEach(function(produto) {
  
  var healthPlan = { "_id" : {"cod" : String(produto.REG_PRODUTO), "operator" : NumberInt(produto.REG_OPERADORA)}, 
    "name" : produto.NOME_PRODUTO, 
    "moderatorFactor" : (produto.FATOR_MODERADOR.toLowerCase() == "sim" ? true : false), 
    "coverageAreaType" : produto.ABRANGENCIA_GEOGRAFICA.toLowerCase().replace(" ", "-"), 
  }
  
  // Status
  if(produto.COMERCIALIZACAO) {
    if(produto.COMERCIALIZACAO.startsWith("Liberada")) {
      healthPlan.status = "liberada";
    } else if(produto.COMERCIALIZACAO.startsWith("Ativo Com Comercialização Suspensa")) {
      healthPlan.status = "ativo-com-comercializacao-suspensa";
    } else {
      healthPlan.status = produto.COMERCIALIZACAO.toLocaleLowerCase().replace(" ", "-");
    }
  }
  
  // Coverage
  healthPlan.coverageTypes = [];
  if(produto.COBERTURA) {
    produto.COBERTURA = produto.COBERTURA.toLocaleLowerCase();
    if(produto.COBERTURA == "referência") {
      healthPlan.coverageTypes.push("referencia");
      healthPlan.coverageTypes.push("ambulatorial");
      healthPlan.coverageTypes.push("hospitalar");
      healthPlan.coverageTypes.push("obstetricia");
    } else {
    	if(produto.COBERTURA.includes("ambulatorial") || produto.COBERTURA.includes("amb ")) {
      		healthPlan.coverageTypes.push("ambulatorial");
    	}
    	if(produto.COBERTURA.includes("hospitalar") || produto.COBERTURA.includes("hosp ")) {
      		healthPlan.coverageTypes.push("hospitalar");
   		}
    	if(produto.COBERTURA.includes("com obste")) {
      		healthPlan.coverageTypes.push("obstetricia");
    	}
    	if(produto.COBERTURA.includes("odonto")) {
      		healthPlan.coverageTypes.push("odontologica");
    	}
    }
  }
  
  // Accomodation
  if(produto.ACOMODACAO) {
    if(produto.ACOMODACAO == "Sem Acomodação") {
      healthPlan.accomodation = "sem-acomodacao";
    } else {
    	healthPlan.accomodation = produto.ACOMODACAO.toLocaleLowerCase();
    }
  }
  
  // Contract type
  if(produto.TIPO_CONTRATACAO) {
    healthPlan.contractType = contractTypes[produto.TIPO_CONTRATACAO];
  }
  
  db.healthplans_test.update( { _id : healthPlan._id } , healthPlan , true );
  
  // Coverage Area
  var coverage = {};
  if(produto.AREA_GEOGRAFICA_ATUACAO && produto.AREA_GEOGRAFICA_ATUACAO != "Nacional") {
    if(produto.ABRANGENCIA_GEOGRAFICA == "Estadual" || produto.ABRANGENCIA_GEOGRAFICA == "Grupo de estados") {
      coverage.state = produto.AREA_GEOGRAFICA_ATUACAO.toLocaleLowerCase();
    } else {
      var cidadeEstado = produto.AREA_GEOGRAFICA_ATUACAO.toLocaleLowerCase().split("-");
      
      var coverage = {};
      coverage.state = cidadeEstado[1];
      
      coverage.cities = [];
      coverage.cities.push(cidadeEstado[0].replace(" ", "-"))
    }
    db.healthplans_test.update({ _id : healthPlan._id }, {"$addToSet":{coverageArea: coverage}});
  }
});

