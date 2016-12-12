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
  ],

  // Options
  {
    cursor: {
      batchSize: 50
    }
  }

  // Created with 3T MongoChef, the GUI for MongoDB - http://3t.io/mongochef

);

providers.forEach(function (provider) {

	var produtos_hospitais = provider.produtos_hospitais;
	delete provider.produtos_hospitais;
	provider.healthPlans = produtos_hospitais.map(function(prod_hosp) {
	  healthPlan = {"plan" : { "cod": String(prod_hosp.REG_PRODUTO), "operator" : NumberInt(prod_hosp.REG_OPERADORA)}};
	  healthPlan.services = [];
	  if(prod_hosp.PRONTO_SOCORRO && prod_hosp.PRONTO_SOCORRO == "Sim") {
	    healthPlan.services.push("pronto-socorro");
	  }
	  
	  return healthPlan;
	});
	
	db.providers_test.update({"_id" : provider._id}, provider, true);
});
