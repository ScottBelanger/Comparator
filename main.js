var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var eyes = require('eyes');

var routes = require('./routes/index');
var query = require('./rds/queries');
var rateEngine = require('./controllers/rateEngine');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'public/views'));

// Currently we do not want to use jade, all webpages will be
// served as static html.
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Route used for db testing
app.use('/energyUsage', query.energyUsage);
app.use('/user', query.user);
app.use('/comparison', query.comparison);
app.use('/LDC', query.LDC);
app.use('/pricingModel', query.pricingModel);
app.disable('etag');

app.get('/countryList', function(req, res) {
	console.log("Request handler GetCountryList");
	//res.writeHead(200, {"Content-Type": "application/json"});
	rateEngine.getCountryList(function(countryList) {
		console.log(countryList);
		res.send(countryList);
		res.end();
	});
});

app.get('/cityList', function(req, res) {
	console.log("Request handler GetCityList");
	//res.writeHead(200, {"Content-Type": "application/json"});
	console.log(req.query.country);
	rateEngine.getCityList(req.query.country, function(cityList) {
		console.log(cityList);
		res.send(cityList);
		res.end();
	});
});

app.get('/ldcList', function(req, res) {
	console.log("Request handler GetLDCList");
	//res.writeHead(200, {"Content-Type": "application/json"});
	console.log(req.query.city);
	rateEngine.getLDCList(req.query.city, function(ldcList) {
		console.log(ldcList);
		res.send(ldcList);
		res.end();
	});
});

app.get('/rateList', function(req, res) {
	console.log("Request handler GetRateList");
	//res.writeHead(200, {"Content-Type": "application/json"});
	console.log(req.query.city, req.query.ldc);
	rateEngine.getRateList(req.query.city, req.query.ldc, function(rateList) {
		console.log(rateList);
		res.send(rateList);
		res.end();
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
       .send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
     .send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
