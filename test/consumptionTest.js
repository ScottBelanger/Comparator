var Consumption = require( '../models/Consumption' );
var eyes   = require( 'eyes' );

var con1 = new Consumption()

con1.setPoint( Date(), 50000 );
eyes.inspect(con1.getPoint());
