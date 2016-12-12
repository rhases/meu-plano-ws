var produtos_precos = db.ans_produtos_precos.aggregate(

  // Pipeline
  [
    // Stage 1
    {
      $match: { "PRECO_MAXIMO": { $exists: true } }
    },

    // Stage 2
    {
      $group: {
      	"_id" : { "cod": "$REG_PRODUTO", "operator" : "$REG_OPERADORA"},
      	"precos" : {
                  "$push" : {"faixa" : "$FAIXA_ETARIA", "preco": "$PRECO_MAXIMO"}
          }
      }
    }

  ]

);


produtos_precos.forEach(function (produto_precos) {
  
  var map = {
       	"Até 18 anos":"a18orLess", 
        "De 19 a 23": "a19to23", 
        "De 24 a 28":"a24to28", 
        "De 29 a 33":"a29to33", 
        "De 34 a 38":"a34to38", 
        "De 39 a 43":"a39to43", 
        "De 44 a 48":"a44to48", 
        "De 49 a 53":"a49to53", 
        "De 54 a 58":"a54to58", 
        "59 ou mais":"a59orMore"
	  };
	  

    var maxPrice = {};
	produto_precos.precos.forEach(function(value){
	  	var price = parseFloat(value.preco.replace(",", ".")).toFixed(2);
		maxPrice[map[value.faixa]] = Number(price); 	 
	});
	var id = { "cod": String(produto_precos._id.cod), "operator" : NumberInt(produto_precos._id.operator)}
	db.healthplans_test.update({"_id": id}, {$set : {'maxPrice': maxPrice} }, true);
});