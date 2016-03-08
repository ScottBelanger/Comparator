// ===== Module Imports =====
var connection     = require( '../rds/connection' );
var populateModels = require( '../rds/userLogin' );
var User           = require( '../models/User' );
var eyes           = require( 'eyes' );
var crypto         = require( 'crypto' );

// ===== Globals =====
var user = new User();

// ===== Defines =====
const SUCCESS    = 0;
const WRONG_PASS = -1;
const USER_DNE   = -2;

/* userLogin is a middleware function for the POST to /login
 * userLogin validates the login credentials and populates the
 * models in memory based on the user information in the database
 */
var userLogin = function( req, res, next ) {

  var hash = crypto.createHash('sha256');
  hash.update( req.body.password );

  // Validate login info and populate model
  validateLogin( req.body.username, hash.digest('hex'), function( err, rc, usr ) {

    if( err ) {

      console.log( err );
      throw err;

    } else {

      res.login_status = rc;

      if( rc != SUCCESS ) {

        next();

      } else {

        populateModels( usr, function( err, usr ) {

          res.userModel = usr;
          
          // Move to next middleware
          next();

        });

      }

    }

  });

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
          callback( err, SUCCESS, user );

        } else {

          // Incorrect password for user
          rc = WRONG_PASS;
          callback( err, WRONG_PASS, user );

        }

      } else {
        
        // The user does not exist in the database
        callback( err, USER_DNE, user );

      }

    }

  });

};

module.exports = userLogin;
