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

// ===== Globals =====
var _user = null; // User object to be used throughout this file.

var saveComparison = function( userID, comparison, isNew, callback ) {

  if( isNew ) {
    insertComparison( userID, comparison, function( err, rc ) {
      if( err ) {
        console.log(err);
        throw err;
      } else {
        callback( null, rc );
      }
    });
  } else {
    updateComparison( userID, comparison, function( err, rc ) {
      if( err ) {
        console.log(err);
        throw err;
      } else {
        callback( null, rc );
      }
    });
  }
};

var insertComparison = function( userID, comparison, callback ) {
  
  if( comparison.rateBundle ) {
    insertRateComparison(userID, comparison, function() {
      
    });
  } else if ( comparison.usageBundle ) {
    insertUsageComparison(userID, comparison, function() {
    });
  } else {
    throw new Error( "No comparison type" );
  }

};

var insertRateComparison = function( userID, rateComparison, callback ) {
  var rateBundleArr = rateComparison.getAllRateBundle();

  // Iterate through each rateBundle and see which ones are new and 
  // need to be inserted
  rateBundleArr.forEach( function( rateBundle ) {
    if( rateBundle.isNew ) {
      insertRateBundle( rateBundle, function( err, rc, id ) {
        if( err ) {
          console.log(err);
          throw err;
        } else {
          rateBundle.setId( id );
          callback( null, rc );
        }
      }
    }
  });
};

var insertUsageComparison = function( userID, usageComparison, callback ) {
  var usageBundleArr = usageComparison.getAllusageBundle();

  // Iterate through each usageBundle and see which ones are new and 
  // need to be inserted
  usageBundleArr.forEach( function( usageBundle ) {
    if( usageBundle.isNew ) {
      insertusageBundle( usageBundle, function( err, rc, id ) {
        if( err ) {
          console.log(err);
          throw err;
        } else {
          usageBundle.setId( id );
          callback( null, rc );
        }
      }
    }
  });
};

var insertRateBundle = function( rateBundle, callback ) {
  var pricingModel = rateBundle.pricingModel;
  var costArr = rateBundle.cost;
  var costDone = false;
  var pricingModelDone = false;
  var firstCost = true;
  var costId = null;
  
  costArr.forEach( function( cost ) {
    if( cost.isNew ) {
      insertCost( cost, id, function( err, rc, id ) {
        if( firstCost ) {
          costId = id;
        }
        cost.setId( costId );
        costDone = true;
        if( costDone && pricingModelDone ) {
          callback( null, rc, id );
        }
      });
    }
  });

  if( pricingModel.isNew ) {
    insertPricingModel( pricingModel, function( err, rc, id ) {
      pricingModel.setId( id );
      pricingModelDone = true;
      if( costDone && pricingModelDone ) {
        call( null, rc, id );
      }
    });
  }
};

var insertUsageBundle = function( usageBundle, callback ) {
  var energyUsage = usageBundle.energyUsage;
  var costArry = usageBundle.cost;
  var costDone = false;
  var energyUsageDone = false;
  var firstCost = true;
  var costId = null;

  costArr.forEach( function( cost, index, array ) {
    if( cost.isNew ) {
      insertCost( cost, id, function( err, id ) {
        if( firstCost ) {
          costId = id;
		  firstCost = false;
        }
        cost.setId( costId );
		if( index == array.length - 1 ) {
          costDone = true;
		}
        if( costDone && energyUsageDone ) {
          callback( null, id );
        }
      });
    }
  });

  if( energyUsage.isNew ) {
    insertEnergyUsage( energyUsage, function( err, id ) {
      energyUsage.setId( id );
      energyUsageDone = true;
      if( costDone && energyUsageDone ) {
        callback( null, id );
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
	if( consumptionArr[index] ) {
		if(firstConsumptionDemand) {
		  insert = {Time: consumptionArr[index].Time, Consumption: consumptionArr[index].amount};
		} else {
		  insert = {ID: energyUsageID, Time: consumptionArr[index].Time, Consumption: consumptionArr[index].amount};
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
	  }
	});
	if(index == array.length - 1) {
		callback(null, energyUsageID);
	}
  });

};

var insertPricingModel = function( pricingModel, callback ) {
  

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
