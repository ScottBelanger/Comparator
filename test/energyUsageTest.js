var EnergyUsage = require( '../models/EnergyUsage' );
var Consumption = require( '../models/Consumption' );
var Demand      = require( '../models/Demand' );
var eyes        = require( 'eyes' );
var sleep       = require( 'sleep' );

var con1 = new Consumption();
var con2 = new Consumption();
var dem1 = new Demand();
var dem2 = new Demand();
var eu   = new EnergyUsage();

var date1 = Date();
sleep.sleep(2);
var date2 = Date();

con1.setPoint( date2, 60000 );
con2.setPoint( date1, 209 );
eu.addConsumption( con1 );
eu.addConsumption( con2 );
eu.sortConsumption();

dem1.setPoint( date1, 50000 );
dem2.setPoint( date2, 2918273);
eu.addDemand( dem1 );
eu.addDemand( dem2 );
eu.sortDemand();

eu.setDemand( date2, 123456789 );

eyes.inspect( eu.getAllConsumption() );
eyes.inspect( eu.getAllDemand() );
eyes.inspect( eu.getConsumption( date1 ) );
eyes.inspect( eu.getDemand( date2 ) );
eyes.inspect( eu.getConsumption( date2 ) );
eyes.inspect( eu.getDemand( date1 ) );
