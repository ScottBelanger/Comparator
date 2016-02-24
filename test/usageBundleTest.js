var UsageBundle = require( '../models/UsageBundle' );
var EnergyUsage = require( '../models/EnergyUsage' );
var Consumption = require( '../models/Consumption' )
var Demand      = require( '../models/Demand' );
var Cost        = require( '../models/Cost' );
var eyes        = require( 'eyes' );
var sleep       = require( 'sleep' );

var ub = new UsageBundle();
var eu = new EnergyUsage();
var con1 = new Consumption();
var con2 = new Consumption();
var dem1 = new Demand();
var dem2 = new Demand();
var cost1 = new Cost();
var cost2 = new Cost();
var date1 = Date();
sleep.sleep(2);
var date2 = Date();

con1.setPoint( date1, 50000 );
eu.addConsumption( con1 );
con2.setPoint( date2, 25 );
eu.addConsumption( con2 );

dem1.setPoint( date1, 60000 );
eu.addDemand( dem1 );
dem2.setPoint( date2, 5687 );
eu.addDemand( dem2 );

cost1.setPoint( date1, 12.34 );
cost2.setPoint( date2, .34 );
ub.addCost( cost1 );
ub.addCost( cost2 );

ub.setEnergyUsage( eu );
ub.setDescription( "This is a test!" );
ub.setId( 823764 );
ub.setCost( date2, 1.00 );

eyes.inspect( ub.getEnergyUsage() );
eyes.inspect( ub.getAllCost() );
eyes.inspect( ub.getCost( date2 ) );
eyes.inspect( ub.getId() );
eyes.inspect( ub.getDescription() );
