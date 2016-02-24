var Demand = require( '../models/Demand' );
var eyes   = require( 'eyes' );

var dem = new Demand();

dem.setPoint( Date(), 50000 );
eyes.inspect(dem.getPoint());
