db.ans_produtos.aggregate(

  // Pipeline
  [
    // Stage 1
    {
      $match: { $and: [ { "AREA_GEOGRAFICA_ATUACAO": { $exists: true } }, { "ABRANGENCIA_GEOGRAFICA": "Estadual" } ] }
    },

    // Stage 2
    {
      $group: { 
          "_id" : {"cod" : "$REG_PRODUTO", "operator" : "$REG_OPERADORA"}, 
          "area" : {
              "$push" : "$AREA_GEOGRAFICA_ATUACAO"
          },
          "count" : {
              "$sum" : 1
          }
      }
    },

    // Stage 3
    {
      $match: { 
          "count" : {
              "$gt" : 1
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
