var Consumption = function() {
/* ===== Consumption Fields ===== */
  this.time   = Date();
  this.amount = 0;
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

module.exports = Consumption;
