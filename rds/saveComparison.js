// ===== Module Imports =====
var connection  = require( './connection' );
var RateBundle  = require( '../models/rateBundle' );
var UsageBundle = require( '../models/usageBundle' );
var EnergyUsage = require( '../models/energyUsage' );
var PricingModel= require( '../models/pricingModel' );
var Consumption = require( '../models/consumption' );
var Demand      = require( '../models/demand' );
var Cost        = require( '../models/cost' );
var Comparison  = require( '../models/comparison' );

// ===== Globals =====
var _user = null; // User object to be used throughout this file.

var saveComparison = function( userID, comparison, isNew, callback ) {

  if( isNew ) {
    insertComparison( userID, comparison, function( err, rc ) {
      if( err ) {
        console.log(err);
        throw err;
      } else {
        callback( null, rc );
      }
    });
  } else {
    updateComparison( userID, comparison, function( err, rc ) {
      if( err ) {
        console.log(err);
        throw err;
      } else {
        callback( null, rc );
      }
    });
  }
};

var insertComparison = function( userID, comparison, callback ) {
  
  if( comparison.rateBundle ) {
    insertRateComparison(userID, comparison, function() {
    });
  } else if ( comparison.usageBundle ) {
    insertUsageComparison(userID, comparison, function() {
    });
  } else {
    throw new Error( "No comparison type" );
  }

};

var updateComparison = function( userID, comparison, callback ) {

  if( comparison.rateBundle ) {
    updateRateComparion(userID, comparison, function() {
    });
  } else if ( comparison.usageBundle ) {
    updateUsageComparison(userID, comparison, function() {
    });
  } else {
    throw new Error( "No comparison type" );
  }

};

var updateRateComparison = function( userID, rateComparison, callback ) {

};

var updateUsageComparison = function( userID, usageComparison, callback ) {

};

var insertRateComparison = function(userID, usageComparison, callback) {

};

var insertUsageComparison = function(userID, usageComparison, callback) {

};

module.exports = saveComparison;
