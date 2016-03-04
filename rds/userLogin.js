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
          callback( null, user.getId() );

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
  var selectComparisons = 'SELECT ID, PricingModelID, EnergyUsageID ' +
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
        if( true ) {
			
	  // Create new comparison and populate fields
	  var comparison = new Comparison.UsageComparison();
          user.addComparison( comparison );
          comparison.setId( item.ID );
          comparison.setDescription( "Not set up yet!" );
          
    	  // SQL query
          var selectPricingModels = 'SELECT RateType, Name, Country, City ' +
                                    'FROM PricingModel LEFT OUTER JOIN LDC ' +
                                    'ON LDCID=LDC.ID ' +
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
                pm.setLDC( rows[0].Name );
                pm.setRateType( rows[0].RateType );
                pm.setCountry( rows[0].Country );
                pm.setCity( rows[0].City );
		comparison.setPricingModel( pm );
  
	      }
		  
    	   });
		  
         } else { // If rate comparison
		
           // Create new comparison and populate fields
           var comparison = new Comparison.RateComparison();
	   user.addComparison( comparison );
           comparison.setId( item.ID );
           comparison.setDescription( "Not set up yet!" );
			
           // SQL query
           var selectEnergyUsage = 'SELECT Time, Consumption, Demand, Cost ' +
                                   'FROM EnergyUsage WHERE ID=' + item.ID;

           // Get Energy Usage model for comparison
           connection.query( selectEnergyUsage, function( err, rows, fields ) {
             
             if( err ) {

               // Log database errors
               console.log( err );
               throw err;

             } else {
               
               var ub = new UsageBundle();
               var eu = new EnergyUsage();

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

	 }
		
       });
    }
    
  });

};

var debugUser = function() {
	eyes.inspect( user );
}


module.exports = userLogin;
