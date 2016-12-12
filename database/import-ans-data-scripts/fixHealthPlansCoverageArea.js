var produtos = db.healthplans_test.find({ $and: [ { "coverageArea": { $exists: true} }, { "coverageAreaType": { $exists: true } }, { "coverageAreaType": { $ne: "nacional" } } ] }).noCursorTimeout();

//var produtos = db.healthplans_test.find({"_id":{ "cod" : "400055992", "operator" : 347183 }}).noCursorTimeout();

produtos.forEach(function(produto) {
  print(JSON.stringify(produto))
  
  var estadosMapa = {};
  
  produto.coverageArea.forEach(function(area){
  	if(!estadosMapa[area.state]){
  	   estadosMapa[area.state] = [];
  	}
  	for(index in area.cities){
  	  var city = (area.cities[index]);
  	  	if(!(estadosMapa[area.state].indexOf(city)>=0)){
  			estadosMapa[area.state].push(area.cities[index]);
  	  	}
  	}
  	//estadosMapa[area.state].add(area.cities);
  });
  
  var estadosArray = [];
  
  for(key in estadosMapa){
  	var estado = {"state":key, "cities":estadosMapa[key]}
  	estadosArray.push(estado);
  }

  print("result:"+JSON.stringify(estadosArray));
  //db.healthplans_test.update( { _id : healthPlan._id } , healthPlan , true );
  db.healthplans_test.update({ _id : produto._id }, {"$set":{coverageArea: estadosArray}} , true );
});

