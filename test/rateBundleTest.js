var RateBundle  = require( '../models/RateBundle' );
var PricingModel= require( '../models/PricingModel' );
var Cost        = require( '../models/Cost' );
var eyes        = require( 'eyes' );
var sleep       = require( 'sleep' );

var rb = new RateBundle();
var pm = new PricingModel();
var cost1 = new Cost();
var cost2 = new Cost();
var date1 = Date();
sleep.sleep(2);
var date2 = Date();

cost1.setPoint( date1, 12.34 );
cost2.setPoint( date2, .34 );
rb.addCost( cost1 );
rb.addCost( cost2 );

pm.setRateType( "Time of Use" );
pm.setLDC( "London Hydro" );
pm.setCountry( "Canada" );
pm.setCity( "London" );

rb.setPricingModel( pm );
rb.setDescription( "This is a test!" );
rb.setId( 823764 );
rb.setCost( date2, 1.00 );

eyes.inspect( rb.getPricingModel() );
eyes.inspect( rb.getAllCost() );
eyes.inspect( rb.getCost( date2 ) );
eyes.inspect( rb.getId() );
eyes.inspect( rb.getDescription() );
