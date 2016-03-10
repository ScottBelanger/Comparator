// ===== Module Imports =====
var connection     = require( '../rds/connection' );
var populateModels = require( '../rds/userLogin' );
var User           = require( '../models/user' );
var sess           = require( '../controller/session_controller');
var eyes           = require( 'eyes' );
var crypto         = require( 'crypto' );

// ===== Globals =====
var user = new User();

// ===== Defines =====
const SUCCESS       = 0;
const WRONG_PASS    = -1;
const USER_DNE      = -2;
const NOT_LOGGED_IN = -3;

/* userLogin is a middleware function for the POST to /login
 * userLogin validates the login credentials and populates the
 * models in memory based on the user information in the database
 */
var userLogin = function( req, res, next ) {

  var hashPass = crypto.createHash('sha256');
  hashPass.update( req.body.password );

  var hashUserId = crypto.createHash('sha256');
  hashUserId.update( req.body.username );

  // Validate login info and populate model
  validateLogin( req.body.username, hashPass.digest('hex'), function( err, rc, usr ) {

    if( err ) {

      console.log( err );
      throw err;

    } else {

      res.login_status = rc;

      if( rc != SUCCESS ) {

        next();

      } else {
        var exp = new Date(Date.now() + 1000 * 60 * 120);
        var hashID = hashUserId.digest('hex');
        res.cookie('SID', hashID, { expires: exp });
        req.app._sessionController.addSession( new sess.Session( usr, hashID, exp));

        populateModels( usr, function( err, usr ) {
          
          // Move to next middleware
          next();


        });

      }

    }

  });

};

var userLogout = function( req, res, next ) {
  // TODO: delete session needs to save current comparison data
  // before logging out. Save code isn't written yet so that will
  // happen later on.
  req.app._sessionController.deleteSession( req.cookies.SID, req.app._sessionController );
  res.clearCookie( 'SID' );
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

var isAuthenticated = function( req, res, next ) {

  req.isAuthenticated = NOT_LOGGED_IN;

  console.log( "Authenticating user" );
  req.app._sessionController._sessions.forEach( function( session ) {
    if( session._sessionID == req.cookies.SID ) {
      req.isAuthenticated = SUCCESS;
      req.app._sessionController.refreshSession( session._sessionID );
    }
  });

  next();

};

module.exports =  { userLogin : userLogin,
                    userLogout: userLogout,
                    isAuthenticated : isAuthenticated };
