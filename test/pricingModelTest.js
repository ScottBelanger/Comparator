var PricingModel = require( '../models/PricingModel' );
var eyes         = require( 'eyes' );

var pm = new PricingModel();

pm.setRateType( "Time of use" );
pm.setLDC( "London Hydro" );
pm.setCountry( "Canada" );
pm.setCity( "London" );

eyes.inspect( pm.getRateType() );
eyes.inspect( pm.getLDC() );
eyes.inspect( pm.getCountry() );
eyes.inspect( pm.getCity() );
