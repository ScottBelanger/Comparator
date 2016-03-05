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
	  var comparison = new Comparison.UsageComparison();
          user.addComparison( comparison );
          comparison.setId( item.ID );
          comparison.setDescription( item.Name );
          
    	  // SQL query
          var selectPricingModels = 'SELECT RateType.Name as RateName, LDC.Name as LDCName, Country.Name as CountryName, City.Name as CityName ' +
                                    'FROM PricingModel LEFT OUTER JOIN LDC ' +
                                    'ON LDCID=LDC.ID LEFT OUTER JOIN COUNTRY ' +
                                    'ON LDC.CountryID=Country.ID LEFT OUTER JOIN ' +
                                    'ON LDC.CityID=City.City.ID ' +
                                    'WHERE PricingModel.ID=' + item.PricingModelID;

    	  // Get pricing model for comparison
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
		comparison.setPricingModel( pm );
  
	      }
		  
    	   });

           // SQL query
           var selectUsageBundle = 'SELECT ID, CostID, EnergyUsageID' +
                                   'FROM UsageBundle ' +
                                   'WHERE UsageBundle.ID=' + item.UsageBundleID;

           // Get usage bundle model for comparison
           connection.query( selectUsageBundle, function( err, rows, fields ) {

             if( err ) {

               console.log( err );
               throw err;

             } else {

               row.forEach( function( item ) {

                 var ub = new UsageBundle();
                 ub.setId( item.ID );

                 var selectEnergyUsage = 'SELECT Time, Consumption, Demand ' +
                                         'FROM EnergyUsage ' +
                                         'WHERE ID=' + item.EnergyUsageID;

                 connection.query( selectEnergyUsage , function( err, rows, fields ) {

                   if( err ) {

                     console.log( err );
                     throw err;

                   } else {

                     var eu = new EnergyUsage();
                     ub.setEnergyUsage( eu );

                     row.forEach( function( item ) {

                       // Populate energy usage fields
                       var con  = null;
                       var dem  = null;

                       // If this is a consupmtion
                       if( item.Consumption != null ) {

                         con = new Consumption();
                         con.setPoint( item.Time, item.Consumption );
                         ub.setConsumption( con );

                       }

                       // If this is a demand
                       if( item.Demand != null ) {

                         dem = new Demand();
                         dem.setPoint( item.Time, item.Demand );
                         ub.setDemand( dem );

                       }

                     });

                   }

                 });

                 var selectCost = 'SELECT Time, Cost' +
                                  'FROM Cost' +
                                  'WHERE ID=' + item.CostID;

                 connection.query( selectCost, function( err, rows, fields ) {

                 if( err ) {

                   console.log( err );
                   throw err;

                 } else {

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
           var comparison = new Comparison.RateComparison();
	   user.addComparison( comparison );
           comparison.setId( item.ID );
           comparison.setDescription( item.Name );
			
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
               
               var eu = new EnergyUsage();
               comparison.setEnergyUsage( eu );

               rows.forEach( function( item ) {

                 // Populate energy usage fields
                 var con  = null;
                 var dem  = null;

                 // If this is a consupmtion
                 if( item.Consumption != null ) {

                   con = new Consumption();
                   con.setPoint( item.Time, item.Consumption );
                   eu.setConsumption( con );

                 }

                 // If this is a demand
                 if( item.Demand != null ) {

                   dem = new Demand();
                   dem.setPoint( item.Time, item.Demand );
                   eu.setDemand( dem );

                 }

               });

             }
             
           });

           var selectRateBundle = 'SELECT * ' +
                                  'FROM RateBundle ' +
                                  'WHERE RateBundle.ID=' + item.RateBundleID;

           connection.query( selectRateBundle, function( err, rows, fields ) {

             if( err ) {

               // Log database errors
               console.log( err );
               throw err;

             } else {

               rows.forEach( function( item ) {

                 var rb = new RateBundle();
                 rb.setId( item.ID );
                 
                 var selectPricingModels = 'SELECT RateType.Name as RateName, LDC.Name as LDCName, Country.Name as CountryName, City.Name as CityName ' +
                                           'FROM PricingModel LEFT OUTER JOIN LDC ' +
                                           'ON LDCID=LDC.ID LEFT OUTER JOIN COUNTRY ' +
                                           'ON LDC.CountryID=Country.ID LEFT OUTER JOIN ' +
                                           'ON LDC.CityID=City.City.ID ' +
                                           'WHERE PricingModel.ID=' + item.PricingModelID;

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
                     comparison.setPricingModel( pm );
      
                   }

                 });
                 
                 var selectCost = 'SELECT Time, Cost' +
                                  'FROM Cost' +
                                  'WHERE ID=' + item.CostID;

                 connection.query( selectCost, function( err, rows, fields ) {

                   if( err ) {

                     console.log( err );
                     throw err;

                   } else {

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

	 }
		
       });
    }
    
  });

};

var debugUser = function() {
	eyes.inspect( user );
}


module.exports = userLogin;
