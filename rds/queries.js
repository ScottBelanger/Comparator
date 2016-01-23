var connection = require('./connection');

var energyUsage = function(req, res, next) {
  // Query using existing connection.
  connection.query('SELECT * from EnergyUsage', function(err, rows, fields) {
    if(err) {
      console.log(err);
      throw err;
    } else {
      res.send(rows);
    }
  });
};

var user = function(req, res, next) {
  // Query using existing connection.
  connection.query('SELECT * from User', function(err, rows, fields) {
    if(err) {
      console.log(err);
      throw err;
    } else {
      res.send(rows);
    }
  });
}

var comparison = function(req, res, next) {
  // Query using existing connection.
  connection.query('SELECT * from Comparison', function(err, rows, fields) {
    if(err) {
      console.log(err);
      throw err;
    } else {
      res.send(rows);
    }
  });
}

var LDC = function(req, res, next) {
  // Query using existing connection.
  connection.query('SELECT * from LDC', function(err, rows, fields) {
    if(err) {
      console.log(err);
      throw err;
    } else {
      res.send(rows);
    }
  });
}

var pricingModel = function(req, res, next) {
  // Query using existing connection.
  connection.query('SELECT * from PricingModel', function(err, rows, fields) {
    if(err) {
      console.log(err);
      throw err;
    } else {
      res.send(rows);
    }
  });
}

// Export all functions.
module.exports = {
  energyUsage  : energyUsage,
  user         : user,
  comparison   : comparison,
  LDC          : LDC,
  pricingModel : pricingModel
};
