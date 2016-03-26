angular
	.module('comparisonPage')
	.controller('comparisonMasterController', comparisonMasterController); //this is where injection could occur

function comparisonMasterController($scope, $rootScope, $http) {
	var masterCtrl = this;
	
	//for local
	var rateEngineURL = 'http://localhost:3001';
	//for remote
	//var rateEngineURL = 'http://rateeng-env.us-west-2.elasticbeanstalk.com';
	
	//masterCtrl RateComparison which has many rateBundles
	var consumptionArray = [];
	var pricingModelArray = [];
	var costArray = [];
	
	$scope.$on('newConsumptionArray', function(event, consArray) {
		//Add new pricing model to the pricingModelArray
		//console.log("In master newConsumptionArray");
		consumptionArray = consArray;
		//console.log(consumptionArray);
		
		$rootScope.$broadcast('setConsumptionForGraph', 0, "Consumption", consumptionArray);
	});
	
	$scope.$on('newPricingModel', function(event, pricingModel) {
		console.log("In master newPricingModel")
		pricingModelArray.push(pricingModel);
		getCost(consumptionArray, pricingModel);
	});
	
	$scope.$on('deletePricingModel', function(event, id) {
		$rootScope.$broadcast('removeCostSeries', id);
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
			//console.log(costObject);
			var pricingModelLabel = pricingModel.ldc + ": " + pricingModel.rateType;
			$rootScope.$broadcast('updateCostTimePM', pricingModel.id,  pricingModelLabel, costObject.values);
		}, function(result){
			// error
		});
	}
}