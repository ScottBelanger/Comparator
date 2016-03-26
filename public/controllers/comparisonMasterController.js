angular
	.module('comparisonPage')
	.controller('comparisonMasterController', comparisonMasterController); //this is where injection could occur

// ===== Module Imports =====
var RateBundle       = require( '../../models/rateBundle' );
var UsageBundle      = require( '../../models/usageBundle' );
var EnergyUsage      = require( '../../models/energyUsage' );
var PricingModel     = require( '../../models/pricingModel' );
var Consumption      = require( '../../models/consumption' );
var Demand           = require( '../../models/demand' );
var Cost             = require( '../../models/cost' );
var Comparison       = require( '../../models/comparison' );

var isRateComp = 1;
var comparison = new Comparison();
var bundle = "";

console.log("when does this fire");


function comparisonMasterController($scope, $rootScope, $http) {
	var masterCtrl = this;
	
	//for local
	var rateEngineURL = 'http://localhost:3001';
	//for remote
	//var rateEngineURL = 'http://rateeng-env.us-west-2.elasticbeanstalk.com';

	console.log("does isRateComp work" + isRateComp);
	
	//masterCtrl RateComparison which has many rateBundles
	//when i uncomment these lines, it breaks the page. the graphs don't load properly. can't figure out why
/*	if (isRateComp)
	{
		bundle = new RateBundle();
		comparison = new RateComparison();
	}
	else
	{
		bundle = new usageBundle();
		comparison = new UsageComparison();
	}
*/


	//variables used before Laura implemented new model structure, shoukd be able to delete them once model is implemented 
	var consumptionArray = [];
	var pricingModelArray = [];
	var costArray = [];

	
	$scope.$on('newConsumptionArray', function(event, consArray) {
		//Add new pricing model to the pricingModelArray
		console.log("In master newConsumptionArray");

		//implementing the new models
		//first make consArray an array of consumption objects and add to an energy usage
/*		var energyUsage = new EnergyUsage();
		
		consArray.ForEach(function(item){
			energyUsage.addConsumption(item);
		});
		
		// then add the energy usage to a rate bundle or usage bundle
		if (isRateComp)
		{
			//add the single consumption value to the rateComparison
			comparison.setEnergyUsage(energyUsage);

		}
		//if it is a usage comparison, then there are multiple usages
		else
		{
			var newUsageBundle = new UsageBundle();
			newUsageBundle.setEnergyUsage(energyUsage);
			comparison.addUsageBundle(newUsageBundle);
		}
		

		//need to send just the comparison to the graph, not the whole energy usage
		$rootScope.$broadcast('consumptionForGraph', energyUsage.getAllConsumption());
*/

		//comment out when testing new model
		consumptionArray = consArray;
		$rootScope.$broadcast('consumptionForGraph', consumptionArray);
	});
	
	$scope.$on('newPricingModel', function(event, pricingModel) {
		console.log("In master newPricingModel")
		pricingModelArray.push(pricingModel);
		getCost(consumptionArray, pricingModel);

		
	

/*
		if (isRateComp)
		{
			//add the pricingModel to a new usageBundle

			//add the usageBundle to the rateComparison
			
			//send the getCost function
		}
		//then it is a usageCOmparison
		else
		{
			//add the single pricing model to the usageComparison

			//send the getCost function
		}
*/


	});
	
	$scope.$on('deletePricingModel', function(event, id) {
		//search through pricing model array for the id to match the argument id and remove the pricing model with that id
		var length = pricingModelArray.length;
		for (var i=0; i<length; i++) {
			if (pricingModelArray[i].id == id) {
				pricingModelArray.splice(i,1);
				console.log("deleted pricing model");
				console.log(pricingModelArray);
				return;
			}
		}
	});
	
	function getCost(consumption, pricingModel) {
		console.log(pricingModel);
		console.log(consumption);
		
		if (pricingModel == undefined || consumption == []) {
			console.log("Cannot get cost yet");
			return;
		}
		
		var data = {consumption: consumption,
					pricingModel: pricingModel};
		
		console.log("data to pass:");
		console.log(data);
		
		$http.put(rateEngineURL + '/calculateCost', data).then(function(result){
			//console.log(result.data);
			var costObject = {id: pricingModel.id,
							  values: result.data};
			costArray.push(costObject);
			console.log(costObject);
			
			$rootScope.$broadcast('updateCostTimePM', pricingModel.ldc, costObject.values);
			
		}, function(result){
			// error
		});
	}
}