angular
	.module('comparisonPage')
	.controller('comparisonMasterController', comparisonMasterController); //this is where injection could occur

function comparisonMasterController($scope, $rootScope, $http) {
	var masterCtrl = this;
	
	//for local
	var rateEngineURL = 'http://localhost:3001';
	//for remote
	//var rateEngineURL = 'http://rateeng-env.us-west-2.elasticbeanstalk.com';
	
	var isRateComp = true;
	
	if (isRateComp) {
		var rateComp = {
			energyUsage: {
				consumption: [],
				demand: []
			},
			rateBundle: []
		}
	}
	else { //is usage comparison
		var usageComp = {
			pricingModel: undefined,
			usageBundle: []
		}
	}
	
	//console.log("isRateComp: " + isRateComp);
	//console.log(rateComp);
	
	$scope.$on('newConsumptionArray', function(event, consArray) {
		// add the energy usage to a rate bundle or usage bundle
		if (isRateComp) {
			rateComp.energyUsage.consumption = consArray;
			$rootScope.$broadcast('setConsumptionForGraph', 0, "Consumption", consArray);
			//console.log(rateComp);
		}
		//if it is a usage comparison, then there are multiple usages
		/* else {
			var newUsageBundle = new UsageBundle();
			newUsageBundle.setEnergyUsage(energyUsage);
			comparison.addUsageBundle(newUsageBundle);
		} */
	});
	
	$scope.$on('newPricingModel', function(event, pricingModel) {
		//console.log("In master newPricingModel")
		
		if (isRateComp) {
			//add the pricingModel to a new rateBundle
			var rateBundle = {
				id: pricingModel.id,
				pricingModel: pricingModel,
				cost: [],
				description: ""
			}
			//add the rateBundle to the rateComparison
			rateComp.rateBundle.push(rateBundle);
			//console.log(rateComp);
			
			//send the getCost function
			getCost(rateComp.energyUsage.consumption, pricingModel);
		}
		//then it is a usageCOmparison
		else {
			//add the single pricing model to the usageComparison
			//send the getCost function
		}
	});
	
	$scope.$on('deletePricingModel', function(event, id) {
		$rootScope.$broadcast('removeCostSeries', id);
		//search through pricing model array for the id to match the argument id and remove the pricing model with that id
		if (isRateComp) {
			var length = rateComp.rateBundle.length;
			for (var i=0; i<length; i++) {
				if (rateComp.rateBundle[i].id == id) {
					rateComp.rateBundle.splice(i,1);
					//console.log("deleted pricing model / rate bundle");
					//console.log(rateComp);
					return;
				}
			}
		}
		else { //usage comparison
			//TODO
		}
	});
	
	$scope.$on('modifiedConsumptionPoint', function(event, index, date, newAmount) {
		//console.log("In master at modifiedConsumptionPoint");
		//console.log(index);
		//console.log(date);
		//console.log(newAmount);
		
		if (isRateComp) {
			//update the consumption array to reflect new value
			rateComp.energyUsage.consumption[index].amount = newAmount;
			//console.log("Consumption changed");
			//console.log(rateComp);
			
			//send the single point to the rate engine for EACH pricing model series in cost graph
			var newConsumption = {time: date,
								  amount: newAmount};
			
			//For each pricingModel series, update the cost point
			getCostPointRateComp([newConsumption], 0, rateComp.rateBundle.length, index);
		}
		else { //usage comparison
			//TODO
		}
	});
	
	function getCost(consumption, pricingModel) {
		//console.log(pricingModel);
		//console.log(consumption);
		
		if (pricingModel == undefined || consumption == []) {
			console.log("Cannot get cost yet");
			return;
		}
		
		var data = {consumption: consumption,
					pricingModel: pricingModel};
		
		//console.log("data to pass:");
		//console.log(data);
		
		$http.put(rateEngineURL + '/calculateCost', data).then(function(result) {
			//console.log(result.data);
			var costData = result.data;
			var seriesID = undefined;
			var seriesLabel = "";
			
			if (isRateComp) {
				var index = rateComp.rateBundle.length - 1;
				rateComp.rateBundle[index].cost = costData;
				//console.log("NEW COST");
				//console.log(rateComp);
				seriesID = pricingModel.id;
				seriesLabel = pricingModel.ldc + ": " + pricingModel.rateType;
			}
			else { //usage comparison
				//TODO
			}
			
			$rootScope.$broadcast('newCostTimePM', seriesID,  seriesLabel, costData);
		}, function(result){
			// error
		});
	}
	
	function getCostPointRateComp(consumption, rbIndex, total, pointIndex) {
		if (rateComp.rateBundle[rbIndex] == undefined || consumption == []) {
			console.log("Cannot get cost yet");
			return;
		}
		
		//console.log("In getCostPointRateComp");
		var data = {consumption: consumption,
					pricingModel: rateComp.rateBundle[rbIndex].pricingModel};
					
		$http.put(rateEngineURL + '/calculateCost', data).then(function(result) {
			//console.log(result.data);
			var costData = result.data;
			
			//update cost point on the graph
			$rootScope.$broadcast('updateCostPoint', data.pricingModel.id, costData, pointIndex);
			
			//update the cost array
			rateComp.rateBundle[rbIndex].cost[pointIndex].amount = costData[0].amount;
			//console.log("Updated cost");
			//console.log(rateComp);
			
			//Now continue cycling through all the pricing models to update each point
			rbIndex++;
			if (rbIndex < total) {
				getCostPointRateComp(consumption, rbIndex, total, pointIndex);
			}
			else {
				return;
			}
		}, function(result){
			// error
		});
	}
}