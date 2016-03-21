// ===== Module Imports =====
var connection  = require( './connection' );
var eyes        = require( 'eyes' );
var RateBundle  = require( '../models/rateBundle' );
var UsageBundle = require( '../models/usageBundle' );
var EnergyUsage = require( '../models/energyUsage' );
var PricingModel= require( '../models/pricingModel' );
var Consumption = require( '../models/consumption' );
var Demand      = require( '../models/demand' );
var Cost        = require( '../models/cost' );
var Comparison  = require( '../models/comparison' );
var User        = require( '../models/user' );

// ===== Globals =====
var _user = null; // User object to be used throughout this file.

/*
 * populateModels()
 *
 * Description: Queries the database for all information related to
 *              the supplied user and populates the models with that 
 *              information.
 *
 * Params (in):
 *   user     - The User object to be populated
 *   callback - The callback function
 *
 * Params (out/callback):
 *   err  - Error object
 *   user - user object
 */
var loadUser = function( user, callback ) {

  // Set global user
  _user = user;

  // Get all of the user's comparisons.
  getComparisons( function( err, user, count ) {

    if( err ) {

      console.log( err );
      throw err;

    } else {

      callback( err, user );

    }

  });

};

/*
 * getComparisons()
 *
 * Description: Gets the comparisons for the globally defined user. This
 *              user is unique to each session i.e. user login.
 *
 * Params (in):
 *   None.
 *
 * Params (out/callback):
 *   err             - Error object
 *   _user           - user object
 */
var getComparisons = function ( callback ) {

  //SQL query
  var selectComparisons = 'SELECT * ' +
                          'FROM Comparison WHERE UserID=' + _user.getId();

  // Get all comparisons for user
  connection.query( selectComparisons, function( err, rows, fields ) {

    // Log database errors
    if( err ) {

      console.log( err );
      throw err;

    } else {

      // For counting when to callback
      var callbackCount = 0;
	
      // Iterate through each user comparison	
      rows.forEach( function( item, index, array ) {

        // This happens in the case when there are multiple bundles per
        // comparison as there are multiple comparison rows with the same
        // ID. In this case add bundle to existing comparison.
        var comparison = _user.getComparison( item.ID );
		
        // If usage comparison
        if( item.ComparisonType ) {

          getUsageComparison( item, comparison, function( err, uc ) {

            if( err ) {

              console.log( err );
              throw err;

            } else {

              if( !comparison ) {

                _user.addComparison( uc );

              }

              callbackCount++;

              // If no more comparisons
              if( callbackCount == array.length ) {

                if( typeof callback === "function" ) {

                  callback( err, _user );

                }

              }

            }

          });
    	  
        } else { // If rate comparison
		
          getRateComparison( item, comparison, function( err, rc ) {

            if( err ) {

              console.log( err );
              throw err;
            
            } else {

              if( !comparison ) {

                _user.addComparison( rc );

              }
              
              callbackCount++;

              // If no more comparisons
              if( callbackCount == array.length ) {

                if( typeof callback === "function" ) {

                  callback( err, _user );

                }

              }

            }

          });

        }

      });

    }

  });

};

/*
 * getUsageComparison()
 *
 * Description: Gets the UsageComparisons for the globally defined user. 
 *
 * Params (in):
 *   comparisonRow - Row containing comparison data.
 *   comparison    - Comparison object to populate with data.
 *
 * Params (out/callback):
 *   err - Error object 
 *   uc  - UsageComparison object
 */
var getUsageComparison = function( comparisonRow, comparison, callback ) {

  var uc = null;

  if( comparison ) {

    uc = comparison;

    getUsageBundle( comparisonRow.UsageBundleID, function( err, ub ) {

      if( err ) {
        
        console.log( err );
        throw err;

      } else {

        uc.addUsageBundle( ub );

        if( typeof callback == "function" ) {

          callback( err, uc );

        }

      }

    });
    
  } else {

    // Create new comparison and populate fields
    uc = new Comparison.UsageComparison();
    uc.setId( comparisonRow.ID );
    uc.setDescription( comparisonRow.Name );
    
    getPricingModel( comparisonRow.PricingModelID, function( err, pm ) {

      if( err ) {

        console.log( err );
        throw err;

      } else {

        uc.setPricingModel( pm );

        getUsageBundle( comparisonRow.UsageBundleID, function( err, ub ) {

          if( err ) {

            console.log( err );
            throw err;

          } else {

            uc.addUsageBundle( ub );

            if( typeof callback == "function" ) {

              callback( err, uc );

            }

          }

        });

      }

    });

  }

};

/*
 * getRateComparison()
 *
 * Description: Gets the RateComparisons for the globally defined user. 
 *
 * Params (in):
 *   comparisonRow - Row containing comparison data.
 *   comparison    - Comparison object to populate with data.
 *
 * Params (out/callback):
 *   err - Error object
 *   rc  - RateComparison object
 */
var getRateComparison = function( comparisonRow, comparison, callback ) {

  var rc = null;

  if( comparison ) {

    rc = comparison;

    getRateBundle( comparisonRow.RateBundleID, function( err, rb ) {

      if( err ) {

        console.log( err );
        throw err;

      } else {
        rc.addRateBundle( rb );

        if( typeof callback == "function" ) {

          callback( err, rc );

        }

      }

    });

  } else {

    // Create new comparison and populate fields
    rc = new Comparison.RateComparison();
    rc.setId( comparisonRow.ID );
    rc.setDescription( comparisonRow.Name );

    getEnergyUsage( comparisonRow.EnergyUsageID, function( err, eu, count ) {

      if( err ) {

        console.log( err );
        throw err;

      } else {

        rc.setEnergyUsage( eu );
    
        getRateBundle( comparisonRow.RateBundleID, function( err, rb ) {

          if( err ) {

            console.log( err );
            throw err;

          } else {

            rc.addRateBundle( rb ); 

            if( typeof callback == "function" ) {

             callback( err, rc );

            }

          }

        });

      }

    });

  }

};

/*
 * getPricingModel()
 *
 * Description: Retrieves the PricingModel object from database specified
 *              the pricingModelId and populates the PricingModel object.
 *
 * Params (in):
 *   pricingModelId - ID of PricingModel
 *
 * Params (out/callback):
 *   err - Error object 
 *   pc  - PricingModel object
 */
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

         callback( err, pm );

      }

    }
          
  });

};

/*
 * getRateBundle()
 *
 * Description: Retrieves the RateBundle object from database specified
 *              the rateBundleID and populates the RateBundle object.
 *
 * Params (in):
 *   rateBundleID - ID of RateBundle 
 *
 * Params (out/callback):
 *   err   - Error object 
 *   rbArr - Array of RateBundle objects
 */
var getRateBundle = function( rateBundleID, callback ) {

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

      var pmDone = 0;
      var costDone = 0;

        // Add rate bundle to rate comparison
      var rb = new RateBundle();
      rb.setId( rows[0].ID );
       
      getPricingModel( rows[0].PricingModelID, function( err, pm ) {

        if( err ) {

          console.log( err );
          throw err;

        } else {

          pmDone++;
          rb.setPricingModel( pm );

          if( costDone == 1 && pmDone == 1 ) {

            if( typeof callback == "function" ) {

              callback( err, rb );

            }

          }
          
        }

      });

      getCost( rows[0].CostID, function( err, costArr, count ) {

        if( err ) {

          console.log( err );
          throw err;

        } else {

          costDone++;
          rb.setCostArr( costArr );

          if( costDone == 1 && pmDone == 1 ) {

            if( typeof callback == "function" ) {

              callback( err, rb );

            }

          }

        }

      });

    }

  });

};

/*
 * getUsageBundle()
 *
 * Description: Retrieves the UsageBundle object from database specified
 *              the rateBundleID and populates the RateBundle object.
 *
 * Params (in):
 *   usageBundleID - ID of UsageBundle 
 *
 * Params (out/callback):
 *   err   - Error object 
 *   ubArr - Array of UsageBundle objects
 */
var getUsageBundle = function( usageBundleID, callback ) {

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

      var euDone = 0;
      var costDone = 0;

      // Add usage bundle to usage comparison
      var ub = new UsageBundle();
      ub.setId( rows[0].ID );

      getEnergyUsage( rows[0].EnergyUsageID, function( err, eu, count ) {

        if( err ) {

          console.log( err );
          throw err;

        } else {

          ub.setEnergyUsage( eu );
          euDone++;

          if( euDone == 1 && costDone == 1 ) {

            if( typeof callback == "function" ) {

              callback( err, ub );

            }
          }
        }

      });

      getCost( rows[0].CostID, function( err, costArr, count ) {

        if( err ) {
          
          console.log( err );
          throw err;

        } else {

          ub.setCostArr( costArr );
          costDone++;

          if( euDone == 1 && costDone == 1 ) {

            if( typeof callback == "function" ) {

              callback( err, ub );

            }

          }

        }
          
      });

    }

  });

};

/*
 * getEnergyUsage()
 *
 * Description: Retrieves the EnergyUsage object from database specified
 *              the energyUsageID and populates the EnergyUsage object.
 *
 * Params (in):
 *   energyUsageID - ID of EnergyUsage
 *
 * Params (out/callback):
 *   err              - Error object 
 *   eu               - EnergyUsage object
 *   energyUsageCount - Number of Consumption/Demand points in this EnergyUsage
 */
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

           callback( err, eu, energyUsageCount );

        }

      });

    }

  });

};

/*
 * getCost()
 *
 * Description: Retrieves an array of cost objects from database specified
 *              the costID.
 *
 * Params (in):
 *   costID - ID of Cost
 *
 * Params (out/callback):
 *   err       - Error object 
 *   costArr   - Array of UsageBundle objects
 */
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
		cost.setId( costID );

        costCount++;

        if( costCount == array.length ) {

          if( typeof callback === "function" ) {

            callback( err, costArr );

          }

        }
        
      });

    }

  });

};


module.exports = loadUser;
