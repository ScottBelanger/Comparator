var Comparison = require( './Comparison' );

var User = function() {
  /* ===== User Fields ===== */
  this.userId     = 0;
  this.userName   = "";
  this.password   = "";
  this.email      = "";
  this.isAdmin    = false;
  this.comparison = [];
};

  /* ===== User methods ===== */
User.prototype.getId = function() {
    return this.userId;
};

User.prototype.getUserName = function() {
    return this.userName;
};

User.prototype.setUserName = function( userName ) {
    this.userName = userName;
};

User.prototype.getPassword = function() {
    return this.password;
};

User.prototype.setPassword = function( password ) {
    this.password = password;
};

User.prototype.getEmail = function() {
    return this.email;
};

User.prototype.setEmail = function( email ) {
    this.email = email;
};

User.prototype.isAdmin = function() {
    return this.isAdmin;
};

User.prototype.setAdmin = function( isAdmin ) {
    this.isAdmin = isAdmin;
};

User.prototype.setComparison = function( comparison ) {
  this.comparison.push( comparison );
};

User.prototype.getComparison = function() {
  return this.comparison;
};

module.exports = User;
