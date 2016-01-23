var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var eyes = require('eyes');

var routes = require('./routes/index');
var rdsqueries = require('./rds/queries');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));

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
app.use('/energyUsage', rdsqueries.energyUsage);
app.use('/user', rdsqueries.user);
app.use('/comparison', rdsqueries.comparison);
app.use('/LDC', rdsqueries.LDC);
app.use('/pricingModel', rdsqueries.pricingModel);

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
