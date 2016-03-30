var Cost = function() {
/* ===== Cost Fields ===== */
  this.time   = Date();
  this.amount = 0;
  this.id = 0;
  this.isNew  = true;
  this.needUpdate = true;
};

// Date Formatting stuff
Number.prototype.padLeft = function(base,chr) {
  var len = (String(base || 10).length - String(this).length)+1;
  return len > 0? new Array(len).join(chr || '0')+this : this;
};

/* ===== Cost Methods ===== */
Cost.prototype.setPoint = function( time, amount ) {
  this.time = [ time.getFullYear(),
           (time.getMonth()+1).padLeft(),
           time.getDate().padLeft()].join('-') +
           ' ' +
         [ time.getHours().padLeft(),
           time.getMinutes().padLeft()].join(':');
  this.amount = amount;
};

Cost.prototype.getPoint = function() {
  return { time   : this.time, 
           amount : this.amount 
         };
};

Cost.prototype.setId = function( id ) {
	this.id = id;
};

module.exports = Cost;
