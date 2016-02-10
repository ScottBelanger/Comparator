var Cost = require( '../models/Cost' );
var eyes   = require( 'eyes' );

var cost = new Cost();

cost.setPoint( Date(), 50000 );
eyes.inspect(cost.getPoint());
