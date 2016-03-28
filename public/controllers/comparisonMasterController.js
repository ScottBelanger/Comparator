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
	
	console.log(localStorage.getItem('username'));
	console.log(localStorage.getItem('userId'));
	
	var pageType = localStorage.getItem('comparisonPage');
	console.log("page type: " + pageType);
	
	var userID = localStorage.getItem('userId');
	
	//should put this in an initializer
	
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
				totalCost: 0,
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
		
		//index is the point in the array that the consumption and cost points are located
		
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
			alert("Cannot get cost without at least one consumption input and one pricing model");
			return;
		}
		
		var data = {consumption: consumption,
					pricingModel: pricingModel};
		
		//console.log("data to pass:");
		//console.log(data);
		
		$http.put(rateEngineURL + '/calculateCost', data).then(function(result) {
			//console.log(result.data);
			var costData = result.data.costArray;
			//TODO handle total cost
			var totalCost = result.data.totalCost;
			var seriesID = undefined;
			var seriesLabel = "";
			
			if (isRateComp) {
				var index = rateComp.rateBundle.length - 1;
				rateComp.rateBundle[index].cost = costData;
				//SAVE TOTAL COST to rateBundle
				rateComp.rateBundle[index].totalCost = totalCost;
				//console.log("NEW COST");
				//console.log(rateComp);
				seriesID = pricingModel.id;
				seriesLabel = pricingModel.ldc + ": " + pricingModel.rateType;
			}
			else { //usage comparison
				//TODO
			}
			
			$rootScope.$broadcast('newCostTimePM', seriesID,  seriesLabel, costData, totalCost);
		}, function(result){
			// error
		});
	}
	
	function getCostPointRateComp(consumption, rbIndex, total, pointIndex) {
		if (rateComp.rateBundle[rbIndex] == undefined || consumption == []) {
			alert("Cannot get cost without at least one consumption input and one pricing model");
			return;
		}
		//TODO handle new total cost
		//total is total number of rateBundle objects
		
		//console.log("In getCostPointRateComp");
		var data = {consumption: consumption,
					pricingModel: rateComp.rateBundle[rbIndex].pricingModel};
					
		$http.put(rateEngineURL + '/calculateCost', data).then(function(result) {
			//console.log(result.data);
			var costData = result.data.costArray;
			
			//update cost point on the graph
			$rootScope.$broadcast('updateCostPoint', data.pricingModel.id, costData, pointIndex);
			
			//update the cost array
			//update total cost as well
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
	
	masterCtrl.saveComparison = function() {
		console.log("In saveComparison");
		console.log("userID: " + userID);
		
		if (userID == 'undefined') {
			//TODO
			alert("Need to sign up to save comparisons!");
			return;
		}
		
		if (isRateComp) {
			console.log(rateComp);
			
			if (rateComp.rateBundle.length == 0) {
				//TODO
				alert("No comparisons to save!");
				return;
			}
			
			saveComparison(rateComp);
		}
	}
	
	function saveComparison(comparison) {
		data = {userID: userID,
				comparison: comparison};
		$http.post('/comparison/new', data).then(function(result) {
			//TODO
			console.log(result);
		}, function(result){
			// error
		});
	}
	
	masterCtrl.loadComparison = function() {
		console.log("In loadComparison");
		
		if (userID == 'undefined') {
			//TODO
			alert("Need to sign up to load comparisons that you have saved!");
			return;
		}
		
		if (isRateComp) {
			console.log("userID: " + userID);
		}
	}
}