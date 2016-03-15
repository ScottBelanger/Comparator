// ===== Module Imports =====
var connection     = require( '../rds/connection' );
var loadUser       = require( '../rds/loadUser' );
var User           = require( '../models/user' );
var sess           = require( '../controller/session_controller');
var auth_defines   = require( './auth_defines' );
var auth           = require( './auth' );
var eyes           = require( 'eyes' );
var crypto         = require( 'crypto' );

// ===== Globals =====
var user = new User();

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
  auth.validateLogin( req.body.username, hashPass.digest('hex'), function( err, rc, usr ) {

    if( err ) {

      console.log( err );
      throw err;

    } else {

      res.login_status = rc;

      if( rc != auth_defines.SUCCESS ) {

        next();

      } else {
        var exp = new Date(Date.now() + 1000 * 60 * 120);
        var hashID = hashUserId.digest('hex');
        res.cookie('SID', hashID, { expires: exp });
        req.app._sessionController.addSession( new sess.Session( usr, hashID, exp));

        loadUser( usr, function( err, usr ) {
          
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

module.exports =  { userLogin : userLogin,
                    userLogout: userLogout };
