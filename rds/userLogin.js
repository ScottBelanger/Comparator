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

// ===== Global Variables =====
var user = new User();

/* userLogin is a middleware function for the POST to /login
 * userLogin validates the login credentials and populates the
 * models in memory based on the user information in the database
 */
var userLogin = function( req, res, next ) {

  // Validate login info and populate model
  validateLogin( req.body.username, req.body.password, populateModels );

  // Move to next middleware
  next();
};

/* validateLogin will validate provided login credentials against
 * the database.
 * If the credentials are okay, it will call the callback function
 * which will populate the database with the supplied username.
 * If the credentials are not okay, it will log the error.
 * TODO: Password should be hashed in memory and database
 */
var validateLogin = function( username, password, callback ) {

  // SQL query
  var sqlString  = 'SELECT * FROM User WHERE Username=\"' + username + '\"';

  // Get the password for the supplied user
  connection.query( sqlString, function( err, rows, fields ) {

    if( err ) {

      // Log database errors
      console.log( err );
      throw err;

    } else {

      // If there is a password returned, i.e. user exists
      if( rows[0] ) {

        // If the supplied password is the same as what is currently
        // in the database
        if( rows[0].Password == password ) {
			
          // Set up the user information
	  user.setId( rows[0].ID );
    	  user.setUserName( rows[0].Username );
          user.setPassword( rows[0].Password );
          user.setEmail( rows[0].Email );
          user.setAdmin( rows[0].IsAdmin );

          // Populate the models
          callback( null, rows[0].ID );

        } else {

          // Incorrect password for user
          console.log( "Wrong Password" );

        }

      } else {
        
        // The user does not exist in the database
        console.log( "User does not exist" );

      }

    }

  });

};

/*
 * populateModels queries the database for all information related to
 * the supplied user and populate the models with that information.
 */
var populateModels = function( err, userID ) {

  //SQL query
  var selectComparisons = 'SELECT * ' +
                          'FROM Comparison WHERE UserID=' + userID;

  // Get all comparisons for user
  connection.query( selectComparisons, function( err, rows, fields ) {

    // Log database errors
    if( err ) {

      console.log( err );
      throw err;

    } else {
	
      // Iterate through each user comparison	
      rows.forEach( function( item ) {
		
        // If usage comparison
        if( item.ComparisonType ) {
			
	  // Create new comparison and populate fields
	  var uc = new Comparison.UsageComparison();
          user.addComparison( uc );
          uc.setId( item.ID );
          uc.setDescription( item.Name );
          
    	  // SQL query
          var selectPricingModels = 'SELECT RateType.Name as RateName, LDC.Name as LDCName, Country.Name as CountryName, City.Name as CityName ' +
                                    'FROM PricingModel LEFT OUTER JOIN LDC ' +
                                    'ON LDCID=LDC.ID LEFT OUTER JOIN Country ' +
                                    'ON LDC.CountryID=Country.ID LEFT OUTER JOIN City ' +
                                    'ON LDC.CityID=City.ID LEFT OUTER JOIN RateType ' +
                                    'ON PricingModel.RateTypeID=RateType.ID ' +
                                    'WHERE PricingModel.ID=' + item.PricingModelID;

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
		uc.setPricingModel( pm );
  
	      }
		  
    	   });

           // SQL query
           var selectUsageBundle = 'SELECT * ' +
                                   'FROM UsageBundle ' +
                                   'WHERE ID=' + item.UsageBundleID;

           // Get usage bundle for usage comparison
           connection.query( selectUsageBundle, function( err, rows, fields ) {

             if( err ) {

               console.log( err );
               throw err;

             } else {

               rows.forEach( function( item ) {

                 // Add usage bundle to usage comparison
                 var ub = new UsageBundle();
                 ub.setId( item.ID );
                 uc.addUsageBundle( ub );

                 // SQL query
                 var selectEnergyUsage = 'SELECT Time, Consumption, Demand ' +
                                         'FROM EnergyUsage ' +
                                         'WHERE ID=' + item.EnergyUsageID;

                 // Get energy usage for this usage bundle
                 connection.query( selectEnergyUsage , function( err, rows, fields ) {

                   if( err ) {

                     // Log database errors
                     console.log( err );
                     throw err;

                   } else {

                     // Add energy usage to usage bundle
                     var eu = new EnergyUsage();
                     ub.setEnergyUsage( eu );

                     rows.forEach( function( item ) {

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

                     });

                   }

                 });

                 // SQL query
                 var selectCost = 'SELECT Time, Cost ' +
                                  'FROM Cost ' +
                                  'WHERE ID=' + item.CostID;


                 // Get all costs for this usage bundle
                 connection.query( selectCost, function( err, rows, fields ) {

                   if( err ) {

                     console.log( err );
                     throw err;

                   } else {

                     // Add each cost
                     rows.forEach( function( item ) {

                       var cost = new Cost();
                       cost.setPoint( item.Time, item.Cost );
                       ub.addCost( cost );

                     });

                   }

                 });

               });

             }

           });
    	  
         } else { // If rate comparison
		
           // Create new comparison and populate fields
           var rc = new Comparison.RateComparison();
	   user.addComparison( rc );
           rc.setId( item.ID );
           rc.setDescription( item.Name );
			
           // SQL query
           var selectEnergyUsage = 'SELECT Time, Consumption, Demand ' +
                                   'FROM EnergyUsage WHERE ID=' + item.EnergyUsageID;

           // Get Energy Usage model for comparison
           connection.query( selectEnergyUsage, function( err, rows, fields ) {
             
             if( err ) {

               // Log database errors
               console.log( err );
               throw err;

             } else {
               
               // Add energy usage to rate comparison
               var eu = new EnergyUsage();
               rc.setEnergyUsage( eu );

               rows.forEach( function( item ) {

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

               });

             }
             
           });

           // SQL query
           var selectRateBundle = 'SELECT * ' +
                                  'FROM RateBundle ' +
                                  'WHERE RateBundle.ID=' + item.RateBundleID;

           // Get each rate bundle for the rate comparison
           connection.query( selectRateBundle, function( err, rows, fields ) {

             if( err ) {

               // Log database errors
               console.log( err );
               throw err;

             } else {

               rows.forEach( function( item ) {

                 // Add rate bundle to rate comparison
                 var rb = new RateBundle();
                 rb.setId( item.ID );
                 rc.addRateBundle( rb );
                 
                 // SQL query
                 var selectPricingModels = 'SELECT RateType.Name as RateName, LDC.Name as LDCName, Country.Name as CountryName, City.Name as CityName ' +
                                           'FROM PricingModel LEFT OUTER JOIN LDC ' +
                                           'ON LDCID=LDC.ID LEFT OUTER JOIN Country ' +
                                           'ON LDC.CountryID=Country.ID LEFT OUTER JOIN City ' +
                                           'ON LDC.CityID=City.ID LEFT OUTER JOIN RateType ' +
                                           'ON PricingModel.RateTypeID=RateType.ID ' +
                                           'WHERE PricingModel.ID=' + item.PricingModelID;

                 // Get pricing model for rate bundle
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
                     rb.setPricingModel( pm );
      
                   }

                 });
                 
                 // SQL query
                 var selectCost = 'SELECT Time, Cost ' +
                                  'FROM Cost ' +
                                  'WHERE ID=' + item.CostID;

                 // Get costs for rate bundle
                 connection.query( selectCost, function( err, rows, fields ) {

                   if( err ) {

                     // Log database errors
                     console.log( err );
                     throw err;

                   } else {

                     // Add each cost to the rate bundle
                     rows.forEach( function( item ) {

                       var cost = new Cost();
                       cost.setPoint( item.Time, item.Cost );
                       rb.addCost( cost );

                     });

                   }

                 });

               });

             }

           });

	 }
		
       });
    }

  });

};

module.exports = userLogin;
