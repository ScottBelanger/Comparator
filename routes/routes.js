// ===== Module Imports =====
var express         = require('express');
var path            = require('path');
var crypto          = require('crypto');
var userActions     = require('../controller/userActions');
var auth            = require('../authentication/auth');
var auth_defines    = require('../authentication/auth_defines');
var compActions     = require('../controller/comparisonActions');
var saveComparison  = require('../rds/saveComparison');
var router          = express.Router();

/* GET home page. 
 * 
 * Description: Services GET request made to / by client. 
 *
 * Middleware: None.
 *
 * Response:   Send index.html
 */
router.get('/', auth.isAuthenticated, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/views/', 'index.html'));
});

router.get('/aboutUsPage', function( req, res,  next ) {
  res.sendFile(path.join(__dirname, '../public/views/', 'aboutUsPage.html'));
});

router.get('/privacyInformation', function( req, res,  next ) {
  res.sendFile(path.join(__dirname, '../public/views/', 'privacyInformation.html'));
});

router.get('/termsPage', function( req, res,  next ) {
  res.sendFile(path.join(__dirname, '../public/views/', 'termsPage.html'));
});

/* GET commercial comparison page. 
 * 
 * Description: Services GET request made to /commercialComparator by client. 
 *
 * Middleware: None.
 *
 * Response:   Send commercialComparator.html
 */
router.get('/commercialComparator', auth.isAuthenticated, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/views/', 'commercialComparator.html'));
});

/* GET residential comparison page. 
 * 
 * Description: Services GET request made to /residentialComparator by client. 
 *
 * Middleware: None.
 *
 * Response:   Send residentialComparator.html
 */
router.get('/residentialComparator', auth.isAuthenticated, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/views/', 'residentialComparator.html'));
});

/* POST login.
 *
 * Description: Services POST request made to /login by client.
 *              Uses userLogin middleware to validate user credentials
 *              and populate user object. The client must provide the 
 *              username and password.
 * 
 * Middleware:  userLogin()
 *
 * Response:    Send return code to client.
 */
router.post('/login',  userActions.userLogin, function(req, res, next) {
  var sessionID = crypto.createHash('sha256').update(req.body.username).digest('hex');
  if( res.login_status == auth_defines.SUCCESS ) {
    req.app._sessionController._sessions.forEach( function( session ) {
      if(session._sessionID == sessionID ) {
        res.send(JSON.stringify(session._user));
      }
    });
  } else {
    res.send( JSON.stringify(res.login_status) );
  }
});

/* GET logout.
 *
 * Description: Services GET request made to /logout by client.
 * 
 * Middleware:  None.
 *
 * Response:    Send return code to client.
 */
router.get('/logout', userActions.userLogout, function(req, res, next) {
  res.send(res.logout_status);
});

/* POST signup.
 *
 * Description: Services POST request made to /signup by client.
 *              Uses userSignup middleware to validate provided
 *              username, email, password, and re-typed password.
 * 
 * Middleware:  userSignup()
 *
 * Response:    Send return code to client.
 */
router.post('/signup', userActions.userSignup, function(req, res, next) {
  var sessionID = crypto.createHash('sha256').update(req.body.username).digest('hex');
  if( res.signup_status == auth_defines.SUCCESS ) {
    req.app._sessionController._sessions.forEach( function( session ) {
      if(session._sessionID == sessionID) {
        res.send(JSON.stringify(session._user));
      }
    });
  } else {
    res.send( JSON.stringify(res.signup_status) );
  }
});

/* POST comparison/:id
 *
 * Description: Services POST request made to /comparison/:id by client.
 *              Takes a comparison object, with the id, and updates/saves
 *              it in the comparator database.
 * 
 * Middleware:  None.
 *
 * Response:    Send return code to client.
 */
router.post('/comparison', function(req, res, next) {
  res.send("Comparison ID");
});

/* POST comparison/new
 *
 * Description: Services POST request made to /comparison/new by client.
 *              Adds a new comparison to the user and saves it in the
 *              comparator database.
 * 
 * Middleware:  None.
 *
 * Response:    Send comparison id to client if success.
 */
router.post('/comparison/new', function(req, res, next) {
  saveComparison(req.body.userID, req.body.comparison, true, function() {
    req.app._sessionController._sessions.forEach( function( session ) {
      if(session._sessionID == req.cookies.SID ) {
        session._user.comparison.push(req.body.comparison);
        res.send("Success");
      }
    });
  });
});

/* GET comparison
 *
 * Description: Services GET request made to /comparison by client.
 *              Returns all the comparison objects for the currently
 *              logged in user (based on cookie sent).
 * 
 * Middleware:  None.
 *
 * Response:    Send array of all comparison objects for user.
 */
router.get('/comparison', auth.isAuthenticated, function(req, res, next) {
  if(req.isAuthenticated == auth_defines.SUCCESS ) {
	  res.send(compActions.getComparisons(req.cookies.SID, req.app._sessionController));  
  } else {
	  res.send(req.isAuthenticated);
  }
});


router.get('/rateEngine', auth.isAuthenticated, function( req, res,  next ) {
  res.sendFile(path.join(__dirname, '../public/views/', 'rateEngine.html'));
});

module.exports = router;
