var connection   = require('../rds/connection');
var auth_defines = require('./auth_defines');
var User         = require('../models/user');

var isAuthenticated = function( req, res, next ) {

  req.isAuthenticated = auth_defines.NOT_LOGGED_IN;

  console.log( "Authenticating user" );
  req.app._sessionController._sessions.forEach( function( session ) {
    if( session._sessionID == req.cookies.SID ) {
      req.isAuthenticated = auth_defines.SUCCESS;
      req.app._sessionController.refreshSession( session._sessionID );
    }
  });

  next();

};

var validateLogin = function( username, password, callback ) {

  var user = new User();

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
          callback( err, auth_defines.SUCCESS, user );

        } else {

          // Incorrect password for user
          rc = auth_defines.WRONG_PASS;
          callback( err, auth_defines.WRONG_PASS, user );

        }

      } else {
        
        // The user does not exist in the database
        callback( err, auth_defines.USER_DNE, user );

      }

    }

  });

};


module.exports = { isAuthenticated : isAuthenticated,
                   validateLogin : validateLogin };
