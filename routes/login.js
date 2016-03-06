// ===== Module imports =====
var express   = require('express');
var userLogin = require('../authentication/auth');
var router    = express.Router();

/* POST login page.
 * This route uses the userLogin middleware to login a user.
 * Currently not sure what to do when user is logged in
 */
router.post('/',  userLogin, function(req, res, next) {
});

module.exports = router;
