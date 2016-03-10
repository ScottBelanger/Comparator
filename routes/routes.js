// ===== Module Imports =====
var express    = require('express');
var path       = require('path');
var auth       = require('../authentication/auth');
var userSignup = require('../rds/userSignup');
var router     = express.Router();

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
router.post('/login',  auth.userLogin, function(req, res, next) {
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
router.get('/logout', auth.userLogout, function(req, res, next) {
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

module.exports = router;
