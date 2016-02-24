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

UsageBundle.prototype.getAllCost = function() {
  return this.cost;
};

UsageBundle.prototype.getCost = function( time, amount ) {
  var costPt = null;

  // Iterate through costs
  for( var i = 0; i < this.cost.length; i++ ) {
    if( this.cost[i].getPoint().time == time ) {
      costPt = this.cost[i].getPoint();
      break;
    }
  }

  // Returns null if cost does not exist
  return costPt;
};

UsageBundle.prototype.addCost = function( cost ) {
  this.cost.push( cost );
};

UsageBundle.prototype.setCost = function( time, amount ) {
  var costPt = null;

  // Iterate through cost
  for( var i = 0; i < this.cost.length; i++ ) {
    if( this.cost[i].getPoint().time == time ) {
      costPt = this.cost[i];
      break;
    }
  }

  if( costPt ) {
    costPt.setPoint( time, amount );
  } else {
    console.log( "Cost does not exist" );
    return costPt;
  }
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
