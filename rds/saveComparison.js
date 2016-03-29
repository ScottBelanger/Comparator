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
  var energyUsageId = null;
  var comparisonId = 0;
  var rateBundleIdArr = [];
  var firstComparison = true;

  // Iterate through each rateBundle and see which ones are new and 
  // need to be inserted
  rateBundleArr.forEach( function( rateBundle, index, array ) {
    insertRateBundle( rateBundle, function( err, id ) {
      if( err ) {
        console.log(err);
        throw err;
      } else {
        rateBundleIdArr.push(id);

        if(index == array.length - 1) {
          rateBundleDone = true;
        }

        if(rateBundleDone && energyUsageDone) {
          connection.getConnection(function(err, connection1) {
            connection1.query(sql, {ID: 0, UserID: userID, EnergyUsageID: energyUsageId, ComparisonType: 0, RateBundleID: rateBundleIdArr[0], Name: "0"}, function(err, result) {
              if(err) {
                console.log(err);
                throw err;
              } else {
                comparisonId = result.insertId;
                connection1.release();
                if( rateBundleIdArr.length == 1 ) {
                  callback( null, result.insertId );
                }
                rateBundleIdArr.forEach(function(rateBundleId, index, array) {
                  if( index != 0 ) {
                    connection.getConnection(function(err, connection2) {
                      connection2.query(sql, {ID: result.insertId, UserID: userID, EnergyUsageID: energyUsageId, ComparisonType: 0, RateBundleID: rateBundleId, Name: index }, function(err, result) {
                        if(err) {
                          console.log(err);
                          throw err;
                        } else {
                          connection2.release();
                          if( index == array.length - 1) {
                            callback( null, comparisonId);
                          }
                        }
                      });
                    });
                  }
                });
              }
            });
          });
        }
      }
    })
  });
  if( energyUsage ) {
    insertEnergyUsage( energyUsage, function(err, id) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        energyUsageId = id;
        energyUsageDone = true;
        if(rateBundleDone && energyUsageDone) {
          connection.getConnection(function(err, connection1) {
            connection1.query(sql, {ID: 0, UserID: userID, EnergyUsageID: energyUsageId, ComparisonType: 0, RateBundleID: rateBundleIdArr[0], Name: "0"}, function(err, result) {
              if(err) {
                console.log(err);
                throw err;
              } else {
                comparisonId = result.insertId;
                connection1.release();
                if( rateBundleIdArr.length == 1 ) {
                  callback( null, result.insertId );
                }
                rateBundleIdArr.forEach(function(rateBundleId, index, array) {
                  if( index != 0 ) {
                    connection.getConnection(function(err, connection2) {
                      connection2.query(sql, {ID: result.insertId, UserID: userID, EnergyUsageID: energyUsageId, ComparisonType: 0, RateBundleID: rateBundleId, Name: index }, function(err, result) {
                        if(err) {
                          console.log(err);
                          throw err;
                        } else {
                          connection2.release();
                          if( index == array.length - 1) {
                            callback( null, comparisonId);
                          }
                        }
                      });
                    });
                  }
                });
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
    if( usageBundle ) {
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

  if( pricingModel ) {
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
				
            connection.getConnection(function(err, connection) {
              connection.query(sql, insert, function( err, result ) {
                if(err) {
                  console.log(err);
                  throw err;
                } else {
                  connection.release();
                  if(firstComparison) {
                    comparisonID = result.insertId;
                  }
                  if( index1 == array1.length - 1) {
                    callback( null, comparisonID);
                  }
                }
              });
            });
	  });  
	}
      }
    });
  }
};

var insertRateBundle = function( rateBundle, callback ) {
  var pricingModel     = rateBundle.pricingModel;
  var costArr          = rateBundle.cost;
  var costDone         = false;
  var pricingModelDone = false;
  var costId           = null;
  var pricingModelId   = null;
  var sql = "INSERT INTO RateBundle SET ?";
  
  insertCost( costArr[0], 0, function( err, insertId ) {
    costId = insertId;
    for(var i=1; i < costArr.length; i++){
      insertCost( costArr[i], costId, function(err, id) {
        if(i == costArr.length) {
          costDone = true;
        }
        if( costDone && pricingModelDone ) {
          connection.getConnection(function(err, connection) {
            connection.query(sql, { PricingModelID: pricingModelId, CostID: costId }, function(err, result) {
              if(err) {
                console.log(err);
                throw err;
              } else {
                connection.release();
                rateBundle.id = result.insertId;
                callback(null, result.insertId);
              }
            });
          });
        }
      });
    }
  });

  insertPricingModel( pricingModel, function( err, insertId ) {
    pricingModelId = insertId;
    pricingModelDone = true;
    if( costDone && pricingModelDone ) {
      connection.getConnection(function(err, connection) {
        connection.query(sql, { PricingModelID: pricingModelId, CostID: costId }, function(err, result) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            rateBundle.id = result.insertId;
            callback(null, result.insertId);
          }
        });
      });
    }
  });
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
    if( cost ) {
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
          connection.getConnection(function(err, connection) {
            connection.query(sql, insert, function(err, result) {
              if(err) {
                console.log(err);
                throw err;
              } else {
                connection.release();
                callback( null, result.insertId );
              }
            });
          });
        }
      });
    }
  });

  if( energyUsage ) {
    insertEnergyUsage( energyUsage, function( err, id ) {
      energyUsageDone = true;
      if( costDone && energyUsageDone ) {
        insert = {CostID: costId, EnergyUsageID: energyUsage.id};
        connection.getConnection(function(err, connection) {
          connection.query(sql, insert, function(err, result){
            if(err) {
              console.log(err);
              throw err;
            } else {
              connection.release();
              callback( null, result.insertId );
            }
          });
        });
      }
    });
  }
};

var insertEnergyUsage = function( energyUsage, callback ) {
  var consumptionArr = energyUsage.consumption;
  var demandArr      = energyUsage.demand;
  var energyUsageId = null;
  var sql = "INSERT INTO EnergyUsage SET ?";

  if(demandArr.length == 0) {
    connection.getConnection(function(err, connection1) {
      connection1.query(sql, {ID: 0, Time: consumptionArr[0].time, Consumption: consumptionArr[0].amount}, function(err, results) {
        energyUsageId = results.insertId;
        connection1.release();
        consumptionArr.forEach(function(consumption, index, array) {
          if( index != 0 ) {
            connection.getConnection(function(err, connection2) {
              connection2.query(sql, {ID: results.insertId, Time: consumption.time, Consumption: consumption.amount}, function(err, results) {
                if(err) {
                  console.log(err);
                  throw err;
                } else {
                  connection2.release();
                  if(index == array.length - 1) {
                    energyUsage.id = energyUsageId;
                    callback(null, energyUsageId);
                  }
                }
              });
            });
          }
        });
      });
    });
  } else {
    connection.getConnection(function(err, connection1) {
      connection1.query(sql, {ID: 0, Time: consumptionArr[0].time, Consumption: consumptionArr[0].amount, Demand: demandArr[0].amount}, function(err, results) {
        energyUsageId = results.insertId;
        connection1.release();
        //for(var i = 1; i < consumptionArr.length; i++) {
        consumptionArr.forEach(function(consumption, index, array) {
          if(index != 0) {
            connection.getConnection(function(err, connection2) {
              connection2.query(sql, {ID: results.insertId, Time: consumption.time, Consumption: consumption.amount, Demand: demandArr[i].amount}, function(err, results) {
                if(err) {
                  console.log(err);
                  throw err;
                } else {
                  connection2.release();
                  if(index == array.length - 1) {
                    energyUsage.id = energyUsageId;
                    callback(null, energyUsageId);
                  }
                }
              });
            });
          }
        });
        //}
      });
    });
  }
};

var insertPricingModel = function( pricingModel, callback ) {
  var sql1 = "SELECT * FROM LDC WHERE Name=\"" + pricingModel.ldc + "\"";
  var sql2 = "SELECT * FROM RateType WHERE Name=\"" + pricingModel.rateType + "\"";
  var sql3 = "INSERT INTO PricingModel SET ?";
  var insert = null;
  
  connection.getConnection(function(err, connection1) {
    connection1.query(sql1, function(err, LDCrows, fields) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection1.release();
        if(LDCrows[0]) {
          connection.getConnection(function(err, connection2) {
            connection2.query(sql2, function(err, RTrows, fields) {
              if(err) {
                console.log(err);
                throw err;
              } else {
                connection2.release();
                if(RTrows[0]) {
                  insert = {LDCID: LDCrows[0].ID, RateTypeID: RTrows[0].ID};
                  connection.getConnection(function(err, connection3) {
                    connection3.query(sql3, insert, function(err, result) {
                      if(err) {
                        console.log(err);
                        throw err;
                      } else {
                        connection3.release();
                        pricingModel.id = result.insertId;
                        callback(null, result.insertId);
                      }
                    });
                  });
                } else {
                  connection.getConnection(function(err, connection4) {
                    connection4.query("INSERT INTO RateType SET ?", {Name: pricingModel.rateType}, function(err, result3) {
                      if(err) {
                        console.log(err);
                        throw err;
                      } else {
                        connection4.release();
                        insert = {LDCID: LDCrows[0].ID, RateTypeID: result3.insertId};
                        connection.getConnection(function(err, connection5) {
                          connection5.query(sql3, insert, function(err, result4) {
                            if(err) {
                              console.log(err);
                              throw err;
                            } else {
                              connection5.release();
                              pricingModel.id = result4.insertId;
                              callback(null, result4.insertId);
                            }
                          });
                        });
                      }
                    });
                  });
                }
              }
            });
          });
        } else {
          connection.getConnection(function(err, connection6) {
            connection6.query("INSERT INTO LDC SET ?", {Name: pricingModel.ldc}, function(err, result1) {
              if(err) {
                console.log(err);
                throw err;
              } else {
                connection6.release();
                connection.getConnection(function(err, connection7) {
                  connection7.query(sql2, function(err, RTrows, fields) {
                    if(err) {
                      console.log(err);
                      throw err;
                    } else {
                      connection7.release();
                      if(RTrows[0]) {
                        insert = {LDCID: result1.insertId, RateTypeID: RTrows[0].ID};
                        connection.getConnection(function(err, connection8) {
                          connection8.query(sql3, insert, function(err, result2) {
                            if(err) {
                              console.log(err);
                              throw err;
                            } else {
                              connection8.release();
                              pricingModel.id = result2.insertId;
                              callback(null, result2.insertId);
                            }
                          });
                        });
                      } else {
                        connection.getConnection(function(err, connection9) {
                          connection9.query("INSERT INTO RateType SET ?", {Name: pricingModel.rateType}, function(err, result3) {
                            if(err) {
                              console.log(err);
                              throw err;
                            } else {
                              connection9.release();
                              insert = {LDCID: result1.insertId, RateTypeID: result3.insertId};
                              connection.getConnection(function(err, connection10) {
                                connection10.query(sql3, insert, function(err, result4) {
                                  if(err) {
                                    console.log(err);
                                    throw err;
                                  } else {
                                    connection10.release();
                                    pricingModel.id = result4.insertId;
                                    callback(null, result4.insertId);
                                  }
                                });
                              });
                            }
                         });
                        });
                     }
                   }
                 });
                });
             }
           });
          });
       }
     }
    });
  });
};

var insertCost = function( cost, id, callback ) {

  var sql = "INSERT INTO Cost SET ?";
  var insert = null;
  
  if(id != 0) {
    // Insert with given ID
    insert = {ID : id, Time : cost.time, Cost : cost.amount};
  } else {
    // Use generated ID
    insert = {Time : cost.time, Cost : cost.amount};
  }
  
  connection.getConnection(function(err, connection) {
    connection.query(sql, insert, function( err, result ) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.release();
        cost.id = result.insertId;
        callback( null, result.insertId );
      }
    });
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
