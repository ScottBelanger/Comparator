var RateBundle   = require( './RateBundle' );
var EnergyUsage  = require( './EnergyUsage' );
var PricingModel = require( './PricingModel' );
var UsageBundle  = require( './UsageBundle' );
var util         = require('util');

/* ===== Comparison Fields ===== */
var Comparison = function() {
  this.id          = 0;
  this.description = "";
};

/* ===== Comparison Methods ===== */
Comparison.prototype.setId = function( id ) {
  this.id = id;
};

Comparison.prototype.getId = function() {
  return this.id
};

Comparison.prototype.setDescription = function( description ) {
  this.description = description;
};

Comparison.prototype.getDescription = function() {
  return this.description;
};


/* ===== RateComparison Fields ===== */
var RateComparison = function() {
  this.energyUsage = new EnergyUsage();
  this.rateBundle  = [];
};

util.inherits( RateComparison, Comparison );

/* ===== RateComparison Methods ===== */
RateComparison.prototype.setEnergyUsage = function( energyUsage ) {
  this.energyUsage = energyUsage;
};

RateComparison.prototype.getEnergyUsage = function() {
  return this.energyUsage;
};

RateComparison.prototype.addRateBundle = function( rateBundle ) {
  this.rateBundle.push( rateBundle );
};

RateComparison.prototype.setRateBundleArr = function( rateBundleArr ) {
  this.rateBundle = rateBundleArr;
};

RateComparison.prototype.getAllRateBundle = function() {
  return this.rateBundle;
};

/* ===== UsageComparison Fields ===== */
var UsageComparison = function() {
  this.pricingModel = new PricingModel();
  this.usageBundle  = [];
};

util.inherits( UsageComparison, Comparison );

/* ===== UsageComparison Methods ===== */
UsageComparison.prototype.setPricingModel = function( pricingModel ) {
  this.pricingModel = pricingModel;
};

UsageComparison.prototype.getPricingModel= function() {
  return this.pricingModel;
};

UsageComparison.prototype.addUsageBundle = function( usageBundle ) {
  this.usageBundle.push( usageBundle );
};

UsageComparison.prototype.setUsageBundleArr = function( usageBundleArr ) {
  this.usageBundle = usageBundleArr;
};

UsageComparison.prototype.getAllUsageBundle = function() {
  return this.usageBundle;
};

module.exports = {
  RateComparison  : RateComparison,
  UsageComparison : UsageComparison
};
