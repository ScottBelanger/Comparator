var Demand = function() {
/* ===== Demand Fields ===== */
  this.time   = Date();
  this.amount = 0;
};

/* ===== Demand Methods ===== */
Demand.prototype.setPoint = function( time, amount ) {
  this.time   = time;
  this.amount = amount;
}

Demand.prototype.getPoint = function() {
  return { time   : this.time, 
           amount : this.amount 
         };
}

module.exports = Demand;
