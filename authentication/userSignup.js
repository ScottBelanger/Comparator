// ===== Module Imports =====
var connection  = require( '../rds/connection' );
var crypto      = require( 'crypto' );
var sess        = require( '../controller/session_controller');
var createUser  = require( '../rds/createUser' );

// ===== Defines =====
const SUCCESS               = 0;
const USERNAME_TAKEN        = -1;
const PASSWORDS_DONOT_MATCH = -2;

/*
 * userSignup()
 *
 * Description: Checks to confirm signup info valid, then inserts the
 *              new user info the database.
 *
 * Params (in):
 *   req  - The client request
 *   res  - The server response
 *   next - The next middleware
 */
var userSignup = function( req, res, next ) {

  var hashUser = crypto.createHash('sha256');
  var hashPass = crypto.createHash('sha256');
  var hashRepass = crypto.createHash('sha256');
  hashUser.update( req.body.username );
  hashPass.update( req.body.password );
  hashRepass.update( req.body.repasswd );

  verifySignupDetails( req.body.username, req.body.email, hashPass.digest('hex'), hashRepass.digest('hex'), function( err, rc, username, email, password) {

    if( err ) {

      console.log( err );
      throw err;

    } else {

      res.signup_status = rc;

      if( rc == SUCCESS ) {

        createUser( username, email, password, function( err, user ) {

          if( err ) {

            console.log( err );
            throw err;

          } else {

            var exp = new Date(Date.now() + 1000 * 120 * 2);
            var hashUserID = hashUser.digest('hex');
            res.cookie('SID', hashUserID, { expires: exp });
            req.app._sessionController.addSession( new sess.Session( user, hashUserID, exp ));

            // Move to next middleware
            next();

          }

        });

      } else {

        next();

      }

    }
    
  });

};

var verifySignupDetails = function( username, email, password, repasswd, callback ) {

  var SQLquery = "SELECT Username FROM User WHERE Username=\"" + username + "\"";

  connection.query( SQLquery, function( err, rows, fields ) {

    if( err ) {

      console.log( err );
      throw err;

    } else {

      if( rows[0] ) {

        if( typeof callback == "function" ) {

          callback( err, USERNAME_TAKEN );

        }

      } else {

        if( password != repasswd ) {

          if( typeof callback == "function" ) {

            callback( err, PASSWORDS_DONOT_MATCH );

          }

        } else {

          if( typeof callback == "function" ) {

            callback( err, SUCCESS, username, email, password );

          }

        }

      }

    }

  });

};


module.exports = userSignup;
