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
	var rateComp = null;
	var usageComp = null;
	
	console.log(localStorage.getItem('username'));
	console.log(localStorage.getItem('userId'));
	
	var pageType = localStorage.getItem('comparisonPage');
	console.log("page type: " + pageType);
	
	var userID = localStorage.getItem('userId');
	
	var userComparisonArray = [];
	
	initializeComparison();
	
	//should put this in an initializer
	function initializeComparison() {
		console.log("initializeComparison");
		if (isRateComp) {
			rateComp = {
				energyUsage: {
					consumption: [],
					demand: []
				},
				rateBundle: []
			}
		}
		else { //is usage comparison
			usageComp = {
				pricingModel: undefined,
				usageBundle: []
			}
		}
		console.log(rateComp);
	}
	
	//console.log("isRateComp: " + isRateComp);
	//console.log(rateComp);
	
	$scope.$on('newConsumptionArray', function(event, consArray) {
		// add the energy usage to a rate bundle or usage bundle
		if (isRateComp) {
			rateComp.energyUsage.consumption = consArray;
			$rootScope.$broadcast('setConsumptionForGraph', 0, "Consumption", rateComp.energyUsage.consumption);
			//console.log(rateComp);
		}
		//if it is a usage comparison, then there are multiple usages
		/* else {
			var newUsageBundle = new UsageBundle();
			newUsageBundle.setEnergyUsage(energyUsage);
			comparison.addUsageBundle(newUsageBundle);
		} */
	});
	
	/* $scope.$on('newPricingModel', function(event, pricingModel) {
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
	}); */
	
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
	
	masterCtrl.newComparisonEvent = function() {
		initializeComparison();
		$rootScope.$broadcast('clearPage');
	}
	
	masterCtrl.saveComparisonEvent = function() {
		console.log("In saveComparison");
		console.log("userID: " + userID);
		
		if (userID == 'undefined' || userID == null) {
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
	
	masterCtrl.loadComparisonEvent = function() {
		console.log("In loadComparison");
		
		if (userID == 'undefined' || userID == null) {
			//TODO
			alert("Need to sign up to load comparisons that you have saved!");
			return;
		}
		
		/* if (isRateComp) {
			console.log("userID: " + userID);
		} */
		
		hardcodedComparison = {
			energyUsage: {
				consumption: [{amount: 5, time: "2016-02-22 03:00"}, {amount: 6, time: "2016-02-22 04:00"}, {amount: 7, time: "2016-02-22 05:00"}],
				demand: []
			},
			rateBundle: [
				{id: 1,
				pricingModel: {
					id: 5,
					country: "Canada",
					city: "London",
					ldc: "London Hydro",
					rateType: "Spot Market"
				},
				cost: [{amount: 10, time: "2016-02-22 03:00"}, {amount: 20, time: "2016-02-22 04:00"}, {amount: 30, time: "2016-02-22 05:00"}],
				totalCost: 60,
				description: "something"},
				{id: 6,
				pricingModel: {
					id: 3,
					country: "Canada",
					city: "London",
					ldc: "London Hydro",
					rateType: "Time Of Use"
				},
				cost: [{amount: 50, time: "2016-02-22 03:00"}, {amount: 50, time: "2016-02-22 04:00"}, {amount: 50, time: "2016-02-22 05:00"}],
				totalCost: 150,
				description: "something"}
			]
		};
		
		loadComparison(hardcodedComparison);
		
		/* $http.get('/comparison').then(function(result) {
			//TODO
			console.log(result.data);
			userComparisonArray = result.data;
			loadComparison(result.data[0]);
		}, function(result){
			// error
		}); */
	}
	
	function loadComparison(comparison) {
		console.log("Loading following comparison...");
		//console.log(comparison);
		
		if (comparison.rateBundle != undefined) {
			isRateComp = true;
			console.log("isRateComp: " + isRateComp);
			initializeComparison();
			loadRateComparison(comparison);
		}
		
		else if (comparison.usageBundle != undefined) {
			isRateComp = false;
			console.log("isRateComp: " + isRateComp);
			initializeComparison();
			//loadUsageComparison(comparison);
		}
	}
	
	function loadRateComparison(comparison) {
		//Need to match up pricingModel ids to the rateBundle ids on the client
		//TODO: This may not be necessary, but it is an unnecessary risk to attempt to not do it
		var length = comparison.rateBundle.length;
		for (var i=0; i<length; i++) {
			comparison.rateBundle[i].pricingModel.id = comparison.rateBundle[i].id;
		}
		rateComp = comparison;
		console.log(rateComp);
		
		//first clear the page
		$rootScope.$broadcast('clearPage');
		$rootScope.$broadcast('clearRows');
		
		//next update the consumption graph
		$rootScope.$broadcast('setConsumptionForGraph', 0, "Consumption", rateComp.energyUsage.consumption);
		
		//then update the cost time graph and update the pricingModel selection rows
		var length = rateComp.rateBundle.length;
		for (var i=0; i<length; i++) {
			var bundle = rateComp.rateBundle[i];
			
			var seriesID = bundle.id;
			var seriesLabel = bundle.pricingModel.ldc + ": " + bundle.pricingModel.rateType;
			var costData = bundle.cost;
			var totalCost = bundle.totalCost;
			
			$rootScope.$broadcast('newCostTimePM', seriesID,  seriesLabel, costData, totalCost);
			$rootScope.$broadcast('newPMSelectionRow', bundle.pricingModel, function() {
				$rootScope.$broadcast('newRow', bundle.pricingModel);
			});
		}
	}
}