var UsageBundle = require( '../models/UsageBundle' );
var EnergyUsage = require( '../models/EnergyUsage' );
var Consumption = require( '../models/Consumption' )
var Demand      = require( '../models/Demand' );
var Cost        = require( '../models/Cost' );
var eyes        = require( 'eyes' );

var ub = new UsageBundle();
var eu = new EnergyUsage();
var con1 = new Consumption();
var con2 = new Consumption();
var dem1 = new Demand();
var dem2 = new Demand();
var cost1 = new Cost();
var cost2 = new Cost();

con1.setPoint( Date(), 50000 );
eu.addConsumption( con1 );
con2.setPoint( Date(), 25 );
eu.addConsumption( con2 );

dem1.setPoint( Date(), 60000 );
eu.addDemand( dem1 );
dem2.setPoint( Date(), 5687 );
eu.addDemand( dem2 );

cost1.setPoint( Date(), 12.34 );
cost2.setPoint( Date(), .34 );

ub.setEnergyUsage( eu );
ub.addCost( cost1 );
ub.addCost( cost2 );
ub.setDescription( "This is a test!" );
ub.setId( 823764 );

eyes.inspect( ub.getEnergyUsage() );
eyes.inspect( ub.getAllCost() );
eyes.inspect( ub.getId() );
eyes.inspect( ub.getDescription() );
