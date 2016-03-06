var express = require('express');
var userLogin = require('../authentication/auth');
var userSignup = require('../rds/userSignup');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* POST login page.
 * This route uses the userLogin middleware to login a user.
 * Currently not sure what to do when user is logged in
 */
router.post('/login',  userLogin, function(req, res, next) {
  res.send( JSON.stringify(res.mydata) );
});

router.post('/signup', userSignup, function(req, res, next) {
  res.send(req.body.username + " " +
           req.body.password + " " +
           req.body.email + " " +
           req.body.repasswd);
});

module.exports = router;
