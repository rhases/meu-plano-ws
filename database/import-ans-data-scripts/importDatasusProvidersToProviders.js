var providers = db.datasus_providers.aggregate(

  // Pipeline
  [
    // Stage 1
    {
      $lookup: { 
          "from" : "ans_produtos_hospitais", 
          "localField" : "_id", 
          "foreignField" : "CNES_PRESTADOR", 
          "as" : "produtos_hospitais"
      }
    },

    // Stage 2
    {
      $match: { 
          "produtos_hospitais" : {
              "$exists" : true, 
              "$not" : {
                  "$size" : 0
              }
          }
      }
    }
  ]
);

providers.forEach(function (provider) {

	var produtos_hospitais = provider.produtos_hospitais;
	delete provider.produtos_hospitais;
	provider.healthPlans = produtos_hospitais.map(function(prod_hosp) {
	  healthPlan = {"plan" : { "cod": String(prod_hosp.REG_PRODUTO), "operator" : NumberInt(prod_hosp.REG_OPERADORA)}};
	  healthPlan.services = [];
	  if(prod_hosp.PRONTO_SOCORRO && prod_hosp.PRONTO_SOCORRO.toUpperCase() == "SIM") {
	    healthPlan.services.push("pronto-socorro");
	  }
	  
	  return healthPlan;
	});
	
	db.providers_test.update({"_id" : NumberInt(provider._id)}, provider, true);
});
