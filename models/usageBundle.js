var Cost        = require( './Cost' );
var EnergyUsage = require( './EnergyUsage' );

var UsageBundle = function() {
  /* ===== UsageBundle Fields ===== */
  this.energyUsage = new EnergyUsage();
  this.cost        = [];
  this.id          = 0;
  this.description = "";
};

/* ===== UsageBungle Methods ===== */
UsageBundle.prototype.getEnergyUsage = function() {
  return this.energyUsage;
};

UsageBundle.prototype.setEnergyUsage = function( energyUsage ) {
  this.energyUsage = energyUsage;
};

UsageBundle.prototype.getCost = function() {
  return this.cost;
};

UsageBundle.prototype.setCost = function( cost ) {
  this.cost.push( cost );
};

UsageBundle.prototype.getId = function() {
  return this.id;
};

UsageBundle.prototype.setId = function( id ) {
  this.id = id;
};

UsageBundle.prototype.getDescription = function() {
  return this.description;
};

UsageBundle.prototype.setDescription = function( description ) {
  this.description = description;
};

module.exports = UsageBundle;
