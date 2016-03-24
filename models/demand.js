var Demand = function() {
/* ===== Demand Fields ===== */
  this.time   = Date();
  this.amount = 0;
  this.id = 0;
  this.isNew  = true;
  this.needsUpdate = true;
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

Demand.prototype.setId = function( id ) {
	this.id = id;
}

module.exports = Demand;
