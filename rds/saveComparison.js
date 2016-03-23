// ===== Module Imports =====
var connection  = require( './connection' );
var RateBundle  = require( '../models/rateBundle' );
var UsageBundle = require( '../models/usageBundle' );
var EnergyUsage = require( '../models/energyUsage' );
var PricingModel= require( '../models/pricingModel' );
var Consumption = require( '../models/consumption' );
var Demand      = require( '../models/demand' );
var Cost        = require( '../models/cost' );
var Comparison  = require( '../models/comparison' );

var saveComparison = function( userID, comparison, isNew, callback ) {

  if( isNew ) {
    insertComparison( userID, comparison, function() {
        callback();
    });
  } else {
    updateComparison( userID, comparison, function() {
        callback();
    });
  }
};

var insertComparison = function( userID, comparison, callback ) {
  
  if( comparison.rateBundle ) {
    insertRateComparison(userID, comparison, function(err, id) {
      comparison.id = id;
      callback();
    });
  } else if ( comparison.usageBundle ) {
    insertUsageComparison(userID, comparison, function(err, id) {
      comparison.id = id;
      callback();
    });
  } else {
    console.log(comparison);
    throw new Error( "No comparison type" );
  }
};

var insertRateComparison = function( userID, rateComparison, callback ) {
  var rateBundleArr = rateComparison.rateBundle;
  var energyUsage = rateComparison.energyUsage;
  var sql = "INSERT INTO Comparison SET ?";
  var insert = null;
  var rateBundleDone = false;
  var energyUsageDone = false;
  var energyUsageId = 0;
  var rateBundleIdArr = [];
  var firstComparison = true;
  var comparisonID = 0;

  // Iterate through each rateBundle and see which ones are new and 
  // need to be inserted
  rateBundleArr.forEach( function( rateBundle, index, array ) {
    if( rateBundle.isNew ) {
      insertRateBundle( rateBundle, function( err, id ) {
        if( err ) {
          console.log(err);
          throw err;
        } else {
          rateBundle.id = id;
          rateBundleIdArr.push(id);

          if(index == array.length - 1) {
            rateBundleDone = true;
          }

          if(rateBundleDone && energyUsageDone) {
            rateBundleIdArr.forEach(function( rateBundleId, index1, array1 ) {
              if(firstComparison) {
                insert = {UserID: userID, EnergyUsageID: energyUsageId, ComparisonType: 0, RateBundleID: rateBundleId };
              } else {
	        insert = {ID: comparisonID, UserID: userID, EnergyUsageID: energyUsageId, ComparisonType: 0, RateBundleID: rateBundleId };
              }
	      connnection.query(sql, insert, function( err, result ) {
	        if(err) {
		  console.log(err);
		  throw err;
		} else {
	          if(firstComparison) {
		    comparisonID = result.insertId;
		  }
						
	          if( index1 == array1.length - 1) {
		    callback( null, comparisonID);
		  }
		}
	      });
            });
          }
        }
      });
    }
  });
  if( energyUsage.isNew ) {
    insertEnergyUsage( energyUsage, function(err, id) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        energyUsage.id = energyUsageId = id;
        energyUsageDone = true;
        if(rateBundleDone && energyUsageDone) {
          rateBundleIdArr.forEach(function( rateBundleId, index1, array1 ) {
	    if(firstComparison) {
	      insert = {UserID: userID, PricingModelID: energyUsageId, ComparisonType: 0, RateBundleID: rateBundleId };
	    } else {
	      insert = {ID: comparisonID, UserID: userID, PricingModelID: energyUsageId, ComparisonType: 0, RateBundleID: rateBundleId };
	    }
				
	    connection.query(sql, insert, function( err, result ) {
	      if(err) {
	        console.log(err);
	        throw err;
	      } else {
	        if(firstComparison) {
	          comparisonID = result.insertId;
		}
	        if( index1 == array1.length - 1) {
	          callback( null, comparisonID);
		}
	      }
	    });
	  });  
	}
      }
    });
  }
};

var insertUsageComparison = function( userID, usageComparison, callback ) {
  var usageBundleArr = usageComparison.usageBundle;
  var pricingModel = usageComparison.pricingModel;
  var sql = "INSERT INTO Comparison SET ?";
  var insert = null;
  var usageBundleDone = false;
  var pricingModelDone = false;
  var pricingModelId = 0;
  var usageBundleIdArr = [];
  var firstComparison = true;
  var comparisonID = 0;

  // Iterate through each usageBundle and see which ones are new and 
  // need to be inserted
  usageBundleArr.forEach( function( usageBundle, index, array ) {
    if( usageBundle.isNew ) {
      insertUsageBundle( usageBundle, function( err, id ) {
        if( err ) {
          console.log(err);
          throw err;
        } else {
          usageBundle.id = id;
	  usageBundleIdArr.push(id);

	  if(index == array.length - 1) {
	    usageBundleDone = true;
	  }

          if(usageBundleDone && pricingModelDone) {
	    usageBundleIdArr.forEach(function( usageBundleId, index1, array1 ) {
	      if(firstComparison) {
	        insert = {UserID: userID, PricingModelID: pricingModelId, ComparisonType: 1, UsageBundleID: usageBundleId };
              } else {
	        insert = {ID: comparisonID, UserID: userID, PricingModelID: pricingModelId, ComparisonType: 1, UsageBundleID: usageBundleId };
	      }
	      connnection.query(sql, insert, function( err, result ) {
	        if(err) {
		  console.log(err);
		  throw err;
		} else {
	          if(firstComparison) {
		    comparisonID = result.insertId;
		  }
						
	          if( index1 == array1.length - 1) {
		    callback( null, comparisonID);
		  }
		}
	      });
	    });
	  }
        }
      });
    }
  });

  if( pricingModel.isNew ) {
    insertPricingModel( pricingModel, function(err, id) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        pricingModel.id = pricingModelId = id;
        pricingModelDone = true;
        if(usageBundleDone && pricingModelDone) {
          usageBundleIdArr.forEach(function( usageBundleId, index1, array1 ) {
	    if(firstComparison) {
	      insert = {UserID: userID, PricingModelID: pricingModelId, ComparisonType: 1, UsageBundleID: usageBundleId };
	    } else {
	      insert = {ID: comparisonID, UserID: userID, PricingModelID: pricingModelId, ComparisonType: 1, UsageBundleID: usageBundleId };
	    }
				
	    connection.query(sql, insert, function( err, result ) {
	      if(err) {
	        console.log(err);
	        throw err;
	      } else {
	        if(firstComparison) {
	          comparisonID = result.insertId;
		}
	        if( index1 == array1.length - 1) {
	          callback( null, comparisonID);
		}
	      }
	    });
	  });  
	}
      }
    });
  }
};

var insertRateBundle = function( rateBundle, callback ) {
  var pricingModel = rateBundle.pricingModel;
  var costArr = rateBundle.cost;
  var costDone = false;
  var pricingModelDone = false;
  var firstCost = true;
  var costId = 0;
  var pricingModelId = 0;
  
  costArr.forEach( function( cost ) {
    if( cost.isNew ) {
      insertCost( cost, costId, function( err, id ) {
        if( firstCost ) {
          costId = id;
        }
        cost.setId( costId );
        costDone = true;
        if( costDone && pricingModelDone ) {
	  connection.query("INSERT INTO RateBundle SET ?", {PricingModelID: pricingModelId, CostID: costId}, function(err, result) {
	    if(err) {
	      console.log(err);
	      throw err;
	    } else {
	      callback(null, result.insertId);
	    }
	  });
        }
      });
    }
  });

  if( pricingModel.isNew ) {
    insertPricingModel( pricingModel, function( err, id ) {
      pricingModel.id = pricingModelId = id;
      pricingModelDone = true;
      if( costDone && pricingModelDone ) {
        connection.query("INSERT INTO RateBundle SET ?", {PricingModelID: pricingModelId, CostID: costId}, function(err, result) {
          if(err) {
	    console.log(err);
	    throw err;
	  } else {
	    callback(null, result.insertId);
	  }
	});
      }
    });
  }
};

var insertUsageBundle = function( usageBundle, callback ) {
  var energyUsage = usageBundle.energyUsage;
  var costArr = usageBundle.cost;
  var costDone = false;
  var energyUsageDone = false;
  var firstCost = true;
  var costId = null;
  var sql = "INSERT INTO UsageBundle SET ?";
  var insert = null;

  costArr.forEach( function( cost, index, array ) {
    if( cost.isNew ) {
      insertCost( cost, costId, function( err, id ) {
        if( firstCost ) {
          costId = id;
	  firstCost = false;
        }
        cost.id = costId;
        if( index == array.length - 1 ) {
          costDone = true;
	}
        if( costDone && energyUsageDone ) {
	  insert = {CostID: costId, EnergyUsageID: energyUsage.id};
          connection.query(sql, insert, function(err, result) {
            if(err) {
              console.log(err);
              throw err;
            } else {
              callback( null, result.insertId );
            }
          });
        }
      });
    }
  });

  if( energyUsage.isNew ) {
    insertEnergyUsage( energyUsage, function( err, id ) {
      energyUsage.id = id
      energyUsageDone = true;
      if( costDone && energyUsageDone ) {
        insert = {CostID: costId, EnergyUsageID: energyUsage.id};
	connection.query(sql, insert, function(err, result){
	  if(err) {
	    console.log(err);
	    throw err;
	  } else {
	    callback( null, result.insertId );
	  }
	});
      }
    });
  }
};

var insertEnergyUsage = function( energyUsage, callback ) {
  var consumptionArr = energyUsage.consumption;
  var demandArr = energyUsage.demand;
  var firstConsumptionDemand = true;
  var energyUsageId = null;
  
  var sql = "INSERT INTO EnergyUsage SET ?";
  var insert = null;

  consumptionArr.forEach( function( consumption, index, array ) {
    if( consumption ) {
      if(firstConsumptionDemand) {
        insert = {Time: consumption.time, Consumption: consumption.amount};
      } else {
        insert = {ID: energyUsageID, Time: consumption.time, Consumption: consumption.amount};
      }
    }
    if( demandArr[index]) {
      insert.Demand = demandArr[index].amount;
    }
    connection.query(sql, insert, function(err, result) {
      if(err) {
        console.log(err);
	throw err;
      } else {
        if(firstConsumptionDemand) {
          energyUsageID = result.insertId;
	  firstConsumptionDemand = false;
	}
		
	consumption.isNew = consumption.needUpdate = false;
	demandArr[index].isnew = demandArr.needUpdate = false;
		
        if(index == array.length - 1) {
	  callback(null, energyUsageID);
	}
      }
    });
  });
};

var insertPricingModel = function( pricingModel, callback ) {
  var sql1 = "SELECT * FROM LDC WHERE Name=\"" + pricingModel.LDC + "\"";
  var sql2 = "SELECT * FROM RateType WHERE Name=\"" + pricingModel.rateType + "\"";
  var sql3 = "INSERT INTO PricingModel SET ?";
  var insert = null;
  
  connection.query(sql1, function(err, LDCrows, fields) {
    if(err) {
      console.log(err);
      throw err;
    } else {
      if(LDCrows[0]) {
        connection.query(sql2, function(err, RTrows, fields) {
          if(err) {
	    console.log(err);
	    throw err;
	  } else {
	    if(RTrows[0]) {
	      insert = {LDCID: LDCrows[0].ID, RateTypeID: RTrows[0].ID};
	      connection.query(sql3, insert, function(err, result) {
	        if(err) {
	          console.log(err);
		  throw err;
		} else {
	          callback(null, result.insertId);
		}
	      });
	    } else {
	      connection.query("INSERT INTO RateType SET ?", {Name: pricingModel.rateType}, function(err, result3) {
	        if(err) {
	          console.log(err);
		  throw err;
		} else {
	          insert = {LDCID: LDCrows[0].ID, RateTypeID: result3.insertId};
                  connection.query(sql3, insert, function(err, result4) {
                    if(err) {
                      console.log(err);
                      throw err;
                    } else {
                      callback(null, result4.insertId);
                    }
                  });
		}
	      });
	    }
	  }
	});
      } else {
        connection.query("INSERT INTO LDC SET ?", {Name: pricingModel.LDC}, function(err, result1) {
          if(err) {
	    console.log(err);
	    throw err;
	  } else {
	    connection.query(sql2, function(err, RTrows, fields) {
	      if(err) {
	        console.log(err);
	        throw err;
	      } else {
	        if(RTrows[0]) {
	          insert = {LDCID: result1.insertId, RateTypeID: RTrows[0].ID};
		  connection.query(sql3, insert, function(err, result2) {
		    if(err) {
		      console.log(err);
		      throw err;
		    } else {
		      callback(null, result2.insertId);
		    }
		  });
		} else {
	          connection.query("INSERT INTO RateType SET ?", {Name: pricingModel.rateType}, function(err, result3) {
		    if(err) {
		      console.log(err);
		      throw err;
		    } else {
		      insert = {LDCID: result1.insertId, RateTypeID: result3.insertId};
		      connection.query(sql3, insert, function(err, result4) {
		        if(err) {
		          console.log(err);
			  throw err;
			} else {
		          callback(null, result4.insertId);
			}
		      });
		    }
		 });
	       }
	     }
	   });
	 }
       });
     }
   }
  });
};

var insertCost = function( cost, id, callback ) {

  var sql = "INSERT INTO Cost SET ?";
  var insert = null;
  
  if(id) {
    // Insert with given ID
    insert = {ID : id, Time : cost.time, Cost : cost.amount};
  } else {
    // Use generated ID
    insert = {Time : cost.time, Cost : cost.amount};
  }
  
  connection.query(sql, insert, function( err, result ) {
    if(err) {
      console.log(err);
      throw err;
    } else {
      cost.isNew = false;
      cost.needUpdate = false;
      callback( null, result.insertId );
    }
  });
};

var updateComparison = function( userID, comparison, callback ) {

  if( comparison.rateBundle ) {
    updateRateComparion(userID, comparison, function() {
    });
  } else if ( comparison.usageBundle ) {
    updateUsageComparison(userID, comparison, function() {
    });
  } else {
    throw new Error( "No comparison type" );
  }

};

var updateRateComparison = function( userID, rateComparison, callback ) {

};

var updateUsageComparison = function( userID, usageComparison, callback ) {

};

var updateRateBundle = function( rateBundleID, rateBundle, callback ) {

};

var updateUsageBundle = function( usageBundleID, usageBundle, callback ) {

};

var updateEnergyUsage = function( energyUsageID, energyUsage, callback ) {

};

var updatePricingModel = function( pricingModelID, pricingModel, callback ) {

};

var updateCost = function( costID, cost, callback ) {

};

var updateConsumptionDemand = function( consumptionDemandID, consumption, demand, callback ) {

};


module.exports = saveComparison;
