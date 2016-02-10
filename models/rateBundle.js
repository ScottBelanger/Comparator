var Cost         = require( './Cost' );
var PricingModel = require( './PricingModel' );

var RateBundle = function() {
  /* ===== RateBundle Fields ===== */
  this.pricingModel = new PricingModel();
  this.cost        = [];
  this.id          = 0;
  this.description = "";
};

/* ===== UsageBungle Methods ===== */
RateBundle.prototype.getEnergyUsage = function() {
  return this.pricingModel;
};

RateBundle.prototype.setEnergyUsage = function( pricingModel ) {
  this.pricingModel = pricingModel;
};

RateBundle.prototype.getCost = function() {
  return this.cost;
};

RateBundle.prototype.setCost = function( cost ) {
  this.cost.push( cost );
};

RateBundle.prototype.getId = function() {
  return this.id;
};

RateBundle.prototype.setId = function( id ) {
  this.id = id;
};

RateBundle.prototype.getDescription = function() {
  return this.description;
};

RateBundle.prototype.setDescription = function( description ) {
  this.description = description;
};

module.exports = RateBundle;
