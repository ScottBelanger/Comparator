var EnergyUsage = require( '../models/EnergyUsage' );
var Consumption = require( '../models/Consumption' );
var Demand      = require( '../models/Demand' );
var eyes        = require( 'eyes' );

var con1 = new Consumption();
var con2 = new Consumption();
var dem1 = new Demand();
var dem2 = new Demand();
var eu   = new EnergyUsage();

con1.setPoint( Date(), 60000 );
con2.setPoint( Date(), 209 );
eu.setConsumption( con1 );
eu.setConsumption( con2 );

dem1.setPoint( Date(), 50000 );
dem2.setPoint( Date(), 2918273);
eu.setDemand( dem1 );
eu.setDemand( dem2 );

eyes.inspect( eu.getConsumption() );
eyes.inspect( eu.getDemand() );
