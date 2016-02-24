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

User.prototype.setId = function( id ) {
  this.userId = id;
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

User.prototype.addComparison = function( comparison ) {
  this.comparison.push( comparison );
};

User.prototype.getAllComparison = function() {
  return this.comparison;
};

User.prototype.getComparison = function( id ) {
  var comp = null;

  for( var i = 0; i < this.comparison.length; i++ ) {
    if( this.comparison[i].getId() == id ) {
      comp = this.comparison[i];
      break;
    }
  }

  // Returns null if comparison does not exist
  return comp;
};

User.prototype.deleteComparison = function( id ) {
  var compIdx = null;

  for( var i = 0; i < this.comparison.length; i++ ) {
    if( this.comparison[i].getId() == id ) {
      compIdx = i;
      break;
    }
  }

  // Remove comparison
  if( compIdx ) {
    this.comparison.splice( compIdx, 1 );
  } else {
    console.log( "Comparison does not exist." );
    return compIdx;
  }
};

module.exports = User;
