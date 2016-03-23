var Consumption = function() {
/* ===== Consumption Fields ===== */
  this.time   = Date();
  this.amount = 0;
  this.id = 0;
  this.isNew = true;
  this.needsUpdate = true;
};

/* ===== Consumption Methods ===== */
Consumption.prototype.setPoint = function( time, amount ) {
  this.time   = time;
  this.amount = amount;
}

Consumption.prototype.getPoint = function() {
  return { time   : this.time, 
           amount : this.amount 
         };
}

Consumption.prototype.setId = function( id ) {
	this.id = id;
}

module.exports = Consumption;
