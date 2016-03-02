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
  var sqlString  = 'SELECT Password FROM User WHERE Username=\"' + username + '\"';

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

          // Populate the models
          callback( null, username );

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
var populateModels = function( err, username ) {
  //SQL query
  var sqlString = "SELECT User.ID AS userID, Username, Password, Email, IsAdmin, " +
                  "User.LDCID, LDC.Name AS LDCName, Country AS LDCCountry, " +
                  "City as LDCCity, ComparisonID, PricingModelID, RateType, " +
                  "EnergyUsageID, Time as EnergyUsageTime, Consumption_x, " +
                  "Consumption_y, Demand_x, Demand_y " +
                  "FROM User LEFT OUTER JOIN LDC " +
                  "ON User.LDCID=LDC.ID LEFT OUTER JOIN Comparison " +
                  "ON User.ComparisonID=Comparison.UserID LEFT OUTER JOIN EnergyUsage " +
                  "ON Comparison.EnergyUsageID=EnergyUsage.ID LEFT OUTER JOIN PricingModel " +
                  "ON Comparison.PricingModelID=PricingModel.ID";

  // Create model objects to store database results
  var user = new User();
  var rb   = new RateBundle();
  var ub   = new UsageBundle();
  var eu   = new EnergyUsage();
  var dem  = new Demand();
  var con  = new Consumption();
  var pm   = new PricingModel();
  var cost = new Cost();
  var date = Date();
  var rc   = new Comparison.RateComparison();
  var uc   = new Comparison.UsageComparison();

  // Get all data about user from database
  connection.query( sqlString, function( err, rows, fields ) {

    // Log database errors
    if( err ) {

      console.log( err );
      throw err;

    } else {

      // Populate model with information from database query
      user.setId( rows[0].userID );
      user.setUserName( rows[0].Username );
      user.setPassword( rows[0].Password );
      user.setEmail( rows[0].Email );
      user.setAdmin( rows[0].IsAdmin );
      eyes.inspect( user );

    }
    
  });

};

module.exports = userLogin;
