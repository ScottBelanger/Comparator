var RateBundle  = require( '../models/RateBundle' );
var UsageBundle = require( '../models/UsageBundle' );
var EnergyUsage = require( '../models/EnergyUsage' );
var PricingModel= require( '../models/PricingModel' );
var Consumption = require( '../models/Consumption' );
var Demand      = require( '../models/Demand' );
var Cost        = require( '../models/Cost' );
var Comparison  = require( '../models/Comparison' );
var eyes        = require( 'eyes' );

var rb = new RateBundle();
var ub = new UsageBundle();
var eu = new EnergyUsage();
var dem = new Demand();
var con = new Consumption();
var pm = new PricingModel();
var cost = new Cost();
var date = Date();
var rc = new Comparison.RateComparison();
var uc = new Comparison.UsageComparison();

dem.setPoint( date, 25);
con.setPoint( date, 30);
cost.setPoint( date, 25.50 );
pm.setRateType( "Time of Use" );
pm.setLDC( "London Hydro" );
pm.setCountry( "Canada" );
pm.setCity( "London" );
eu.addConsumption( con );
eu.addDemand( dem );
ub.addCost( cost );
ub.setEnergyUsage( eu );
ub.setId( 1 );
ub.setDescription( "Usage Bundle 1" );
rb.addCost( cost );
rb.setPricingModel( pm );
rb.setId( 1 );
rb.setDescription( "Rate Bundle 1" );
uc.comparison.setId( 1 );
uc.comparison.setDescription( "Usage Comparison 1" );
uc.addUsageBundle( ub );
uc.setPricingModel( pm );
rc.comparison.setId( 1 );
rc.comparison.setDescription( "Rate Comparison 1" );
rc.addRateBundle( rb );
rc.setEnergyUsage( eu );

eyes.inspect( uc );
eyes.inspect( rc )
