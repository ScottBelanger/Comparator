var RateBundle   = require( './RateBundle' );
var EnergyUsage  = require( './EnergyUsage' );
var PricingModel = require( './PricingModel' );
var UsageBundle  = require( './UsageBundle' );

/* ===== Comparison Fields ===== */
var Comparison = function() {
  this.description = "";
};

/* ===== Comparison Methods ===== */
Comparison.prototype.setDescription = function( description ) {
  this.description = description;
};

Comparison.prototype.getDescription = function() {
  return this.description;
};


/* ===== RateComparison Fields ===== */
var RateComparison = function() {
  this.comparison  = new Comparison();
  this.energyUsage = new EnergyUsage();
  this.rateBundle  = new RateBundle();
};

/* ===== RateComparison Methods ===== */
RateComparison.prototype.setEnergyUsage = function( energyUsage ) {
  this.energyUsage = energyUsage;
};

RateComparison.prototype.getEnergyUsage = function() {
  return this.energyUsage;
};

RateComparison.prototype.setRateBundle = function( rateBundle ) {
  this.rateBundle = rateBundle;
};

RateComparison.prototype.getRateBundle = function() {
  return this.rateBundle;
};

/* ===== UsageComparison Fields ===== */
var UsageComparison = function() {
  this.comparison   = new Comparison();
  this.pricingModel = new PricingModel();
  this.usageBundle  = new UsageBundle();
};

/* ===== UsageComparison Methods ===== */
UsageComparison.prototype.setPricingModel = function( pricingModel ) {
  this.pricingModel = pricingModel;
};

UsageComparison.prototype.getPricingModel= function() {
  return this.pricingModel;
};

UsageComparison.prototype.setUsageBundle = function( usageBundle ) {
  this.usageBundle = usageBundle;
};

UsageComparison.prototype.getUsageBundle = function() {
  return this.usageBundle;
};

module.exports = {
  RateComparison  : RateComparison,
  UsageComaprison : UsageComparison
};
