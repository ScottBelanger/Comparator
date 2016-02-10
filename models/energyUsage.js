var Consumption = require( './Consumption' );
var Demand      = require( './Demand' );

var EnergyUsage = function() {
/* ===== EnergyUsage Fields ===== */
  this.consumption = [];
  this.demand      = [];
};

/* ===== EnergyUsage Methods ===== */
EnergyUsage.prototype.getAllConsumption = function() {
  return this.consumption;
};

EnergyUsage.prototype.getConsumption = function( time ) {
  var conPt = null;

  // Iterate through consumption points
  for( var i = 0; i < this.consumption.length; i++ ) {
    if( this.consumption[i].getPoint().time == time ) {
      conPt = this.consumption[i].getPoint();
      break;
    }
  }

  // Returns null if consumption does not exist
  return conPt;
};

EnergyUsage.prototype.addConsumption = function( consumption ) {
  this.consumption.push( consumption );
};

EnergyUsage.prototype.setConsumption = function( time, amount ) {
  // Consumption must exist before calling this function (this is a 
  // consumption modification function)
  var conPt = null;
  
  // Iterate through consumption points
  for( var i = 0; i < this.consumption.length; i++ ) {
    if( this.consumption[i].getPoint().time == time ) {
      conPt = this.consumption[i];
      break;
    }
  }

  // Logs to error and returns null if point does not exist
  if( conPt ) {
    conPt.setPoint( time, amount );
    return conPt;
  } else {
    console.log( "Consumption does not exist." );
    return conPt;
  }
};

EnergyUsage.prototype.sortConsumption = function() {
  this.consumption.sort( function( con1, con2 ) {
    if( con1.getPoint().time > con2.getPoint().time ) {
      return 1;
    }


    if( con1.getPoint().time < con2.getPoint().time ) {
      return -1;
    }

    return 0;
  });
};

EnergyUsage.prototype.getAllDemand = function() {
  return this.demand;
};

EnergyUsage.prototype.getDemand = function( time ) {
  var demPt = null;

  // Iterate through demand points
  for( var i = 0; i < this.demand.length; i++ ) {
    if( this.demand[i].getPoint().time == time ) {
      demPt = this.demand[i].getPoint();
      break;
    }
  }

  // Returns null if point does not exist
  return demPt;
};

EnergyUsage.prototype.addDemand = function( demand ) {
  this.demand.push( demand );
};

EnergyUsage.prototype.setDemand = function( time, amount ) {
  // Demand must exist before calling this function (this is a 
  // demand modification function)
  var demPt = null;
  
  // Iterate through demand points
  for( var i = 0; i < this.demand.length; i++ ) {
    if( this.demand[i].getPoint().time == time ) {
      demPt = this.demand[i];
      break;
    }
  }

  // Logs to error and returns null if point does not exist
  if( demPt ) {
    demPt.setPoint( time, amount );
    return demPt;
  } else {
    console.log( "Demand does not exist." );
    return demPt;
  }
};

EnergyUsage.prototype.sortDemand = function() {
  this.demand.sort( function( dem1, dem2 ) {
    if( dem1.getPoint().time > dem2.getPoint().time ) {
      return 1;
    }


    if( dem1.getPoint().time < dem2.getPoint().time ) {
      return -1;
    }

    return 0;
  });
};

module.exports = EnergyUsage;
