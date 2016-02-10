var Consumption = require( './Consumption' );
var Demand      = require( './Demand' );

var EnergyUsage = function() {
  /* ===== EnergyUsage Fields ===== */
  this.consumption = [];
  this.demand      = [];
};

/* ===== EnergyUsage Methods ===== */
EnergyUsage.prototype.getConsumption = function() {
  return this.consumption;
};

EnergyUsage.prototype.setConsumption = function( consumption ) {
  this.consumption.push( consumption );
};

EnergyUsage.prototype.getDemand = function() {
  return this.demand;
}

EnergyUsage.prototype.setDemand = function( demand ) {
  this.demand.push( demand );
}


module.exports = EnergyUsage;
