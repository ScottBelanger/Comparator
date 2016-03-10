var crypto = require('crypto');
var user   = require('../models/User');

var session = function() {
  this.user      = null;
  this.sessionID = null;
  this.expires   = null;
};

var session_controller = function() {
  this.sessions = [];
};

module.exports = { session : session,
                   session_controller : session_controller };
