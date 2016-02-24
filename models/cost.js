var Cost = function() {
/* ===== Cost Fields ===== */
  this.time   = Date();
  this.amount = 0;
};

/* ===== Cost Methods ===== */
Cost.prototype.setPoint = function( time, amount ) {
  this.time   = time;
  this.amount = amount;
};

Cost.prototype.getPoint = function() {
  return { time   : this.time, 
           amount : this.amount 
         };
};

module.exports = Cost;
