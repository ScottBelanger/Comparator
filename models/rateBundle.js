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

RateBundle.prototype.getAllCost = function() {
  return this.cost;
};

RateBundle.prototype.getCost = function( date, amount ) {
  var costPt = null;

  // Iterate through costs
  for( var i = 0; i < this.cost.length; i++ ) {
    if( this.cost[i].getPoint().date == date ) {
      costPt = this.cost[i].getPoint();
      break;
    }
  }

  // Returns null if cost does not exist
  return costPt;
};

RateBundle.prototype.addCost = function( cost ) {
  this.cost.push( cost );
};

RateBundle.prototype.setCost = function( date, amount ) {
  var costPt = null;

  // Iterate through cost
  for( var i = 0; i < this.cost.length; i++ ) {
    if( this.cost[i].getPoint().date == date ) {
      costPt = this.cost[i];
      break;
    }
  }

  if( costPt ) {
    costPt.setPoint( date, amount );
  } else {
    console.log( "Cost does not exist" );
    return costPt;
  }
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
