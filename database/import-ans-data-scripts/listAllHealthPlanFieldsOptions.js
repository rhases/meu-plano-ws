var produtos = db.ans_produtos.find();

var result = {
    "COMERCIALIZACAO" : [], 
    "COBERTURA" : [], 
    "ACOMODACAO" : [], 
    "TIPO_CONTRATACAO" : [], 
    "ABRANGENCIA_GEOGRAFICA" : [],
    "AREA_GEOGRAFICA_ATUACAO" : []
 };
    
produtos.forEach(function(produto) {
	if(result.COMERCIALIZACAO.indexOf(produto.COMERCIALIZACAO) == -1) {
	  result.COMERCIALIZACAO.push(produto.COMERCIALIZACAO);
	}
	if(result.COBERTURA.indexOf(produto.COBERTURA) == -1) {
	  result.COBERTURA.push(produto.COBERTURA);
	}
	if(result.ACOMODACAO.indexOf(produto.ACOMODACAO) == -1) {
	  result.ACOMODACAO.push(produto.ACOMODACAO);
	}
	if(result.TIPO_CONTRATACAO.indexOf(produto.TIPO_CONTRATACAO) == -1) {
	  result.TIPO_CONTRATACAO.push(produto.TIPO_CONTRATACAO);
	}
	if(result.ABRANGENCIA_GEOGRAFICA.indexOf(produto.ABRANGENCIA_GEOGRAFICA) == -1) {
	  result.ABRANGENCIA_GEOGRAFICA.push(produto.ABRANGENCIA_GEOGRAFICA);
	}
	if(result.AREA_GEOGRAFICA_ATUACAO.indexOf(produto.AREA_GEOGRAFICA_ATUACAO) == -1) {
	  result.AREA_GEOGRAFICA_ATUACAO.push(produto.AREA_GEOGRAFICA_ATUACAO);
	}
});

result;
