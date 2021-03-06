/* ===== PricingModel Fields ===== */
var PricingModel = function() {
  this.id = 0;
  this.rateType = "";
  this.ldc      = "";
  this.country  = "";
  this.city     = "";
  this.isNew    = true;
  this.needsUpdate = true;
};

/* ===== PricingModel Methods ===== */

PricingModel.prototype.getRateType = function() {
  return this.rateType;
};

PricingModel.prototype.setRateType = function( rateType ) {
  this.rateType = rateType;
};

PricingModel.prototype.getLDC = function() {
  return this.ldc;
};

PricingModel.prototype.setLDC = function( ldc ) {
  this.ldc = ldc;
};

PricingModel.prototype.getCountry = function() {
  return this.country;
};

PricingModel.prototype.setCountry = function( country ) {
  this.country = country;
};

PricingModel.prototype.getCity = function() {
  return this.city;
};

PricingModel.prototype.setCity = function( city ) {
  this.city = city;
};

module.exports = PricingModel;
