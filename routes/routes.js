// ===== Module Imports =====
var express         = require('express');
var path            = require('path');
var userActions     = require('../authentication/userActions');
var auth            = require('../authentication/auth');
var userSignup      = require('../authentication/userSignup');
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
  res.send( JSON.stringify(res.login_status) );
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
  res.sendFile(path.join(__dirname, '../public/views/', 'index.html'));
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
router.post('/signup', userSignup, function(req, res, next) {
  res.send( JSON.stringify(res.signup_status) );
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
  res.send("Comparison New");
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
router.get('/comparison', function(req, res, next) {
  res.send("Get comparisons");
});

module.exports = router;
