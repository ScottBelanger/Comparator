// ===== Module Imports =====
var connection  = require( './connection' );
var eyes        = require( 'eyes' );
var RateBundle  = require( '../models/RateBundle' );
var UsageBundle = require( '../models/UsageBundle' );
var EnergyUsage = require( '../models/EnergyUsage' );
var PricingModel= require( '../models/PricingModel' );
var Consumption = require( '../models/Consumption' );
var Demand      = require( '../models/Demand' );
var Cost        = require( '../models/Cost' );
var Comparison  = require( '../models/Comparison' );
var User        = require( '../models/User' );

// ===== Globals =====
var gUser = null;

/*
 * populateModels queries the database for all information related to
 * the supplied user and populate the models with that information.
 * Params (in):
 *   user   - The model that will be populated
 *   callback - The callback function
 */
var populateModels = function( user, callback ) {

  // Set file global user
  gUser = user;

  // Get all of the user's comparisons
  getComparisons( function( err, usr, cnt ) {
    setTimeout(function() {
      callback( err, usr );
    }, 1000 );
  });

};

var getComparisons = function ( callback ) {

  //SQL query
  var selectComparisons = 'SELECT * ' +
                          'FROM Comparison WHERE UserID=' + gUser.getId();

  // Get all comparisons for user
  connection.query( selectComparisons, function( err, rows, fields ) {

    // Log database errors
    if( err ) {

      console.log( err );
      throw err;

    } else {

      // For counting number of comparisons
      var comparisonCount = 0;
	
      // Iterate through each user comparison	
      rows.forEach( function( item, index, array ) {
		
        // If usage comparison
        if( item.ComparisonType ) {

          getUsageComparison( item, function( err, uc ) {
            gUser.addComparison( uc );
          });
    	  
        } else { // If rate comparison
		
          getRateComparison( item, function( err, rc ) {
            gUser.addComparison( rc );
          });

        }

        comparisonCount++;
        
        // If no more comparisons
        if( comparisonCount == array.length ) {

          if( typeof callback === "function" ) {

            return callback( err, gUser, comparisonCount );

          }

        }
		
      });
    }

  });
};

var getUsageComparison = function( comparison, callback ) {

  // Create new comparison and populate fields
  var uc = new Comparison.UsageComparison();
  uc.setId( comparison.ID );
  uc.setDescription( comparison.Name );

  getPricingModel( comparison.PricingModelID, function( err, pm ) {
    uc.setPricingModel( pm );

    getUsageBundles(comparison.UsageBundleID, function( err, ub ) {

      uc.addUsageBundle( ub );

      if( typeof callback === "function" ) {

        return callback( null, uc );

      }

    });

  });

};

var getRateComparison = function( comparison, callback ) {

  // Create new comparison and populate fields
  var rc = new Comparison.RateComparison();
  rc.setId( comparison.ID );
  rc.setDescription( comparison.Name );

  getEnergyUsage( comparison.EnergyUsageID, function( err, eu, count ) {

    rc.setEnergyUsage( eu );
    
    getRateBundles( comparison.RateBundleID, function( err, rbArr, count ) {

      rc.setRateBundleArr( rbArr ); 

      if( typeof callback == "function" ) {

        return callback( null, rc );

      }

    });

  });

};

var getPricingModel = function( pricingModelId, callback ) {

  // SQL query
  var selectPricingModels = 'SELECT RateType.Name as RateName, LDC.Name as LDCName, Country.Name as CountryName, City.Name as CityName ' +
                            'FROM PricingModel LEFT OUTER JOIN LDC ' +
                            'ON LDCID=LDC.ID LEFT OUTER JOIN Country ' +
                            'ON LDC.CountryID=Country.ID LEFT OUTER JOIN City ' +
                            'ON LDC.CityID=City.ID LEFT OUTER JOIN RateType ' +
                            'ON PricingModel.RateTypeID=RateType.ID ' +
                            'WHERE PricingModel.ID=' + pricingModelId;

  // Get pricing model for usage comparison
  connection.query( selectPricingModels, function( err, rows, fields ) {
                
    if( err ) {
                  
      // Log database errors
      console.log( err );
      throw err;
                  
    } else {
                  
      // Populate pricing model fields
      var pm = new PricingModel();	
      pm.setLDC( rows[0].LDCName );
      pm.setRateType( rows[0].RateName );
      pm.setCountry( rows[0].CountryName );
      pm.setCity( rows[0].CityName );

      if( typeof callback === "function" ) {

        return callback( err, pm );

      }

    }
          
  });

};

var getRateBundles = function( rateBundleID, callback ) {

  // SQL query
  var selectRateBundle = 'SELECT * ' +
                         'FROM RateBundle ' +
                         'WHERE RateBundle.ID=' + rateBundleID;

  // Get each rate bundle for the rate comparison
  connection.query( selectRateBundle, function( err, rows, fields ) {

    if( err ) {

      // Log database errors
      console.log( err );
      throw err;

    } else {

      var rbArr = [];
      var rbCount = 0;

      rows.forEach( function( item, index, array ) {

        // Add rate bundle to rate comparison
        var rb = new RateBundle();
        rbArr.push( rb );
        rb.setId( item.ID );
       
        getPricingModel( item.PricingModelID, function( err, pm ) {
          rb.setPricingModel( pm );
        });

        getCost( item.CostID, function( err, costArr, count ) {
          rb.setCostArr( costArr );
        });

        rbCount++;

        if( rbCount == array.length ) {

          if( typeof callback === "function" ) {

            return callback( err, rbArr, rbCount );

          }

        }

      });

    }

  });

};

var getUsageBundles = function( usageBundleID, callback ) {

  // SQL query
  var selectUsageBundle = 'SELECT * ' +
                          'FROM UsageBundle ' +
                          'WHERE ID=' + usageBundleID;

  // Get usage bundle for usage comparison
  connection.query( selectUsageBundle, function( err, rows, fields ) {

    if( err ) {

      console.log( err );
      throw err;

    } else {

      var ubArr = [];
      var ubCount = 0;

      rows.forEach( function( item, index, array ) {

        // Add usage bundle to usage comparison
        var ub = new UsageBundle();
        ubArr.push( ub );
        ub.setId( item.ID );

        getEnergyUsage( item.EnergyUsageID, function( err, eu, count ) {
          ub.setEnergyUsage( eu );
        });

        getCost( item.CostID, function( err, costArr, count ) {
          ub.setCostArr( costArr );
        });

        ubCount++;

        if( ubCount == array.length ) {

          if( typeof callback === "function" ) {

            return callback( err, ubArr, ubCount );
          }

        }

      });

    }

  });

};

var getEnergyUsage = function( energyUsageID, callback ) {

  // SQL query
  var selectEnergyUsage = 'SELECT Time, Consumption, Demand ' +
                          'FROM EnergyUsage ' +
                          'WHERE ID=' + energyUsageID;

  // Get energy usage for this usage bundle
  connection.query( selectEnergyUsage , function( err, rows, fields ) {

    if( err ) {

      // Log database errors
      console.log( err );
      throw err;

    } else {

      // Add energy usage to usage bundle

      var eu = new EnergyUsage();
      var energyUsageCount = 0;

      rows.forEach( function( item, index, array ) {

        // Populate energy usage fields
        var con  = null;
        var dem  = null;

        // If this is a consupmtion
        if( item.Consumption != null ) {

          con = new Consumption();
          con.setPoint( item.Time, item.Consumption );
          eu.addConsumption( con );

        }

        // If this is a demand
        if( item.Demand != null ) {

          dem = new Demand();
          dem.setPoint( item.Time, item.Demand );
          eu.addDemand( dem );

        }

        energyUsageCount++;

        if( energyUsageCount == array.length ) {

          return callback( err, eu, energyUsageCount );

        }

      });

    }

  });

};

var getCost = function( costID, callback ) {

  // SQL query
  var selectCost = 'SELECT Time, Cost ' +
                   'FROM Cost ' +
                   'WHERE ID=' + costID;


  // Get all costs for this usage bundle
  connection.query( selectCost, function( err, rows, fields ) {

    if( err ) {

      console.log( err );
      throw err;

    } else {
      
      var costArr = [];
      var costCount = 0;

      // Add each cost
      rows.forEach( function( item, index, array ) {

        var cost = new Cost();
        costArr.push( cost );
        cost.setPoint( item.Time, item.Cost );

        costCount++;

        if( costCount == array.length ) {

          if( typeof callback === "function" ) {

            return callback( err, costArr, costCount );

          }

        }
        
      });

    }

  });

};


module.exports = populateModels;
