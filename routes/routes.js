// ===== Module Imports =====
var express    = require('express');
var userLogin  = require('../authentication/auth');
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
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
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
router.post('/login',  userLogin, function(req, res, next) {
  res.send( JSON.stringify(res.login_status) );
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
