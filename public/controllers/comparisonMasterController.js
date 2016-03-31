angular
	.module('comparisonPage')
	.controller('comparisonMasterController', comparisonMasterController); //this is where injection could occur

function comparisonMasterController($scope, $rootScope, $http) {
	var masterCtrl = this;
	
	//for local
	masterCtrl.rateEngineURL = 'http://localhost:3001';
	//for remote
	//masterCtrl.rateEngineURL = 'http://rateeng-env.us-west-2.elasticbeanstalk.com';

	var hasDemand = false;
	var maxDemand = 0;
	var isRateComp;

	masterCtrl.rateComp = null;
	masterCtrl.usageComp = null;
	masterCtrl.userComparisonArray = [];
	
	console.log(localStorage.getItem('username'));
	console.log(localStorage.getItem('userId'));
	var userID = localStorage.getItem('userId');
	
	if (userID == 'undefined' || userID == null) {
		$scope.userLoggedIn = false;
	}
	else {
		$scope.userLoggedIn = true;
	}
	
	var pageType = localStorage.getItem('comparisonPage');
	console.log("page type: " + pageType);
	if (pageType == "commercial")
	{
		hasDemand = true;
	}

	console.log("hasDemand is equal to "+hasDemand);
	
	$scope.$on('setCompType', function(event, selected) {
		console.log("In setCompType");
		console.log("selected: " + selected);
		if (selected == 0) {
			isRateComp = true;
			initializeComparison();
		}
		else if (selected == 1) {
			isRateComp = false;
			initializeComparison();
		}
		else if (selected == 2) {
			masterCtrl.loadComparisonEvent();
		}
	});
	
	//should put this in an initializer
	function initializeComparison() {
		console.log("initializeComparison");
		console.log("isRateComp: " + isRateComp);
		if (isRateComp) {
			masterCtrl.rateComp = {
				energyUsage: {
					consumption: [],
					demand: [],
					maxDemandDate: "",
					hasDemand: false
				},
				rateBundle: []
			}
		}
		else { //is usage comparison
			masterCtrl.usageComp = {
				pricingModel: undefined,
				usageBundle: []
			}
		}
		//console.log(masterCtrl.rateComp);
		$rootScope.$broadcast('loadGraphs');
		$rootScope.$broadcast('loadRows');
	}
	
	//console.log("isRateComp: " + isRateComp);
	//console.log(masterCtrl.rateComp);
	
	$scope.$on('newConsumptionArray', function(event, consArray) {
		// add the energy usage to a rate bundle or usage bundle
		if (isRateComp) {
			masterCtrl.rateComp.energyUsage.consumption = consArray;
			console.log("Setting consumption");
			console.log(masterCtrl.rateComp.energyUsage.consumption);
			$rootScope.$broadcast('setConsumptionForGraph', 0, "Consumption", masterCtrl.rateComp.energyUsage.consumption);
			//console.log(masterCtrl.rateComp);
		}
		//if it is a usage comparison, then there are multiple usages
		/* else {
			var newUsageBundle = new UsageBundle();
			newUsageBundle.setEnergyUsage(energyUsage);
			comparison.addUsageBundle(newUsageBundle);
		} */
	});

	$scope.$on('newDemandArray', function(event, demandArray) {
		// add the energy usage to a rate bundle or usage bundle
		console.log("a new demand array needs to be added to the demandArray");
		
		if (isRateComp) {
			masterCtrl.rateComp.energyUsage.demand = demandArray;
			masterCtrl.rateComp.energyUsage.hasDemand = true;
			for (var i = 0; i < demandArray.length; i++)
			{
				if (demandArray[i].amount > maxDemand)
				{
					maxDemand = demandArray[i].amount;
					masterCtrl.rateComp.energyUsage.maxDemandDate = demandArray[i].time;
				}
			}
			console.log("the max demand is "+ maxDemand);
			//console.log(masterCtrl.rateComp.energyUsage.demand);
			$rootScope.$broadcast('setDemandForGraph', 0, "Demand", demandArray);
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
			masterCtrl.rateComp.rateBundle.push(rateBundle);
			//console.log(masterCtrl.rateComp);
			
			//send the getCost function
			getCost(masterCtrl.rateComp.energyUsage.consumption, maxDemand, pricingModel);

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
			var length = masterCtrl.rateComp.rateBundle.length;
			for (var i=0; i<length; i++) {
				if (masterCtrl.rateComp.rateBundle[i].id == id) {
					masterCtrl.rateComp.rateBundle.splice(i,1);
					//console.log("deleted pricing model / rate bundle");
					//console.log(masterCtrl.rateComp);
					return;
				}
			}
		}
		else { //usage comparison
			//TODO
		}
	});
	
	$scope.$on('modifiedDemandPoint', function(event, index, date, newAmount) {
		//console.log("In master at modifiedConsumptionPoint");
		//console.log(index);
		//console.log(date);
		//console.log(newAmount);
		
		//index is the point in the array that the consumption and cost points are located
		var newConsumption = [];
		
		if (isRateComp) {

			masterCtrl.rateComp.energyUsage.demand[index].amount = newAmount;

			console.log("the new demand amount is "+newAmount);
			console.log("the old max was : "+maxDemand);
			console.log("the new demand date is "+date);
			console.log("the old max date was : "+masterCtrl.rateComp.energyUsage.maxDemandDate);

			if (newAmount > maxDemand )
			{
				maxDemand = newAmount;
				masterCtrl.rateComp.energyUsage.maxDemandDate = date;

				//clear the cost graph
				$rootScope.$broadcast('clearCostTime');

				console.log("the length of the bundle is " + masterCtrl.rateComp.rateBundle.length);
				updateCosts( 0, masterCtrl.rateComp.rateBundle.length );

					
			}
			else if (date == masterCtrl.rateComp.energyUsage.maxDemandDate)
			{
				console.log("need to find the new max");
				//reset max demand to 0
				maxDemand = 0;
				console.log("the length of demand is"+masterCtrl.rateComp.energyUsage.demand.length);
				//replace the current maxDemand with the new amount
				for (var i = 0; i < masterCtrl.rateComp.energyUsage.demand.length;i++)
				{
					if (masterCtrl.rateComp.energyUsage.demand[i].date == date)
						masterCtrl.rateComp.energyUsage.demand[i].amount = newAmount;
				}

				for (var i = 0; i < masterCtrl.rateComp.energyUsage.demand.length; i++)
				{
					if (masterCtrl.rateComp.energyUsage.demand[i].amount > maxDemand )
					{
						maxDemand = masterCtrl.rateComp.energyUsage.demand[i].amount;
						masterCtrl.rateComp.energyUsage.maxDemandDate = masterCtrl.rateComp.energyUsage.demand[i].time;
					}
				}
					
				//clear the cost graph
				$rootScope.$broadcast('clearCostTime');

				console.log("the length of the bundle is " + masterCtrl.rateComp.rateBundle.length);
				updateCosts(0, masterCtrl.rateComp.rateBundle.length );
					
			}
			else
			{
				//otherwise we don't do anything cause the cost won't change
				console.log("don't expect any changes in costs. The demand peak hasn't changed");
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
		var newConsumption = [];
		
		if (isRateComp) {
			//update the consumption array to reflect new value
			
			masterCtrl.rateComp.energyUsage.consumption[index].amount = newAmount;
			//send the single point to the rate engine for EACH pricing model series in cost graph
			newConsumption = {time: date,
							  amount: newAmount};

			//For each pricingModel series, update the cost point
			getCostPointRateComp([newConsumption], 0, masterCtrl.rateComp.rateBundle.length, index);
	
		}
		else { //usage comparison
			//TODO
		}
	});

	function getCost(consumption, demand, pricingModel) {
        document.getElementById("loader-wrapper").style.display = "block";
		
		if (pricingModel == undefined || consumption == []) {
			alert("Cannot get cost without at least one consumption input and one pricing model");
			return;
		}
		
		console.log("sending this as the max demand " + demand);

		var data = {consumption: consumption,
					consumptionLength: masterCtrl.rateComp.energyUsage.consumption.length,
					isCommercial: hasDemand,
					maxDemand: maxDemand,
					pricingModel: pricingModel};
		
		
		$http.put(masterCtrl.rateEngineURL + '/calculateCost', data).then(function(result) {
			var costData = result.data.costArray;

			//TODO handle total cost
			var totalCost = result.data.totalCost;
        
			var seriesID = undefined;
			var seriesLabel = "";
			
			if (isRateComp) {
				var index = masterCtrl.rateComp.rateBundle.length - 1;
				masterCtrl.rateComp.rateBundle[index].cost = costData;
				//SAVE TOTAL COST to rateBundle
				masterCtrl.rateComp.rateBundle[index].totalCost = totalCost;
				seriesID = pricingModel.id;
				seriesLabel = pricingModel.ldc + ": " + pricingModel.rateType;
			}
			else { //usage comparison
				//TODO
			}
			
			$rootScope.$broadcast('newCostTimePM', seriesID,  seriesLabel, costData, totalCost);
            document.getElementById("loader-wrapper").style.display = "none";
		}, function(result){
			// error
		});
	}
	function updateCosts(PMindex, total) {
		
		if (masterCtrl.rateComp.rateBundle[PMindex].pricingModel == undefined || masterCtrl.rateComp.energyUsage.consumption == []) {
			alert("Cannot get cost without at least one consumption input and one pricing model");
			return;
		}
		

		var data = {consumption: masterCtrl.rateComp.energyUsage.consumption,
					consumptionLength: masterCtrl.rateComp.energyUsage.consumption.length,
					isCommercial: hasDemand,
					maxDemand: maxDemand,
					pricingModel: masterCtrl.rateComp.rateBundle[PMindex].pricingModel};
		
		
		$http.put(masterCtrl.rateEngineURL + '/calculateCost', data).then(function(result) {
			var costData = result.data.costArray;

			//TODO handle total cost
			var totalCost = result.data.totalCost;

			var seriesID = undefined;
			var seriesLabel = "";
			
			if (isRateComp) {
				var index = masterCtrl.rateComp.rateBundle.length - 1;
				masterCtrl.rateComp.rateBundle[index].cost = costData;
				//SAVE TOTAL COST to rateBundle
				masterCtrl.rateComp.rateBundle[index].totalCost = totalCost;
				seriesID = masterCtrl.rateComp.rateBundle[PMindex].pricingModel.id;
				seriesLabel = masterCtrl.rateComp.rateBundle[PMindex].pricingModel.ldc + ": " + masterCtrl.rateComp.rateBundle[PMindex].pricingModel.rateType;
			}
			else { //usage comparison
				//TODO
			}
			
			$rootScope.$broadcast('newCostTimePM', seriesID,  seriesLabel, costData, total);

			//Now continue cycling through all the pricing models to update each point
			PMindex++;
			console.log("the index is " + PMindex + " and the total is "+total);
			if (PMindex < total) {
				updateCosts(PMindex, total);
			}
			else {
				return;
			}

		}, function(result){
			// error
		});
	}
	
	function getCostPointRateComp(consumption, rbIndex, total, pointIndex) {
		console.log("in the get cost point rate comp");
		console.log("the rateComp.rateBundle is "+masterCtrl.rateComp.rateBundle[rbIndex]);
		console.log("the consumption is "+consumption);
		if (masterCtrl.rateComp.rateBundle[rbIndex] == undefined || consumption == []) {
			alert("Cannot get cost without at least one consumption input and one pricing model");
			return;
		}
	
		console.log("check the isCommercial variable : "+masterCtrl.rateComp.energyUsage.hasDemand);
		console.log("the maxDemand is : " + maxDemand);

		var data = {consumption: consumption,
					consumptionLength: masterCtrl.rateComp.energyUsage.consumption.length,
					maxDemand: maxDemand,
					isCommercial: masterCtrl.rateComp.energyUsage.hasDemand,
					pricingModel: masterCtrl.rateComp.rateBundle[rbIndex].pricingModel};
					
		$http.put(masterCtrl.rateEngineURL + '/calculateCost', data).then(function(result) {
			var costData = result.data.costArray;
			console.log("the returning cost is " + costData );

			//update cost point on the graph
			$rootScope.$broadcast('updateCostPoint', data.pricingModel.id, costData, pointIndex);
			
			//update the cost array
			//update total cost as well
			masterCtrl.rateComp.rateBundle[rbIndex].cost[pointIndex].amount = costData[0].amount;
			
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
		//initializeComparison();
		$rootScope.$broadcast('clearPage');
	}
	
	masterCtrl.saveComparisonEvent = function() {
		console.log("In saveComparison");
		console.log("userID: " + userID);
		
		if (!$scope.userLoggedIn) {
			alert("Need to sign up to save comparisons!");
			return;
		}
		
		if (isRateComp) {
			console.log(masterCtrl.rateComp);
			
			if (masterCtrl.rateComp.rateBundle.length == 0) {
				alert("No comparison to save!");
				return;
			}
			document.getElementById("loader-wrapper").style.display = "block";
			saveComparison(masterCtrl.rateComp);
		}
	}
	
	function saveComparison(comparison) {
		data = {userID: userID,
				comparison: comparison};
		$http.post('/comparison/new', data).then(function(result) {
			//TODO
            document.getElementById("loader-wrapper").style.display = "none";
			console.log(result);
			if (result.data == "Success") {
				alert("Save successful!");
			}
		}, function(result){
			// error
		});
	}
	
	masterCtrl.loadComparisonEvent = function() {
		console.log("In loadComparisonEvent");
		
		if (!$scope.userLoggedIn) {
			alert("Need to sign up to load comparisons that you have saved!");
			return;
		}
		
		/*hardcodedComparison = {
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
		
		loadComparison(hardcodedComparison); */
		
		$http.get('/comparison').then(function(result) {
			//TODO
						if (result.data.length == 0) {
							$scope.canLoad = false;
							alert("You have no comparisons saved!");
							return;
						}
						
                        for(var i = 0; i < result.data.length; i++) {
                          if( i == 0 ) {
                            masterCtrl.userComparisonArray.push(result.data[i]);
                          } else {
                            var existingComparison = false;
                            for(var j = 0; j < masterCtrl.userComparisonArray.length; j++ ) {
                              if( masterCtrl.userComparisonArray[j].id == result.data[i].id ) {
                                console.log(masterCtrl.userComparisonArray[j].rateBundle);
                                console.log(result.data[i].rateBundle);
                                masterCtrl.userComparisonArray[j].rateBundle.push(result.data[i].rateBundle[0]);
                                console.log(masterCtrl.userComparisonArray[j].rateBundle);
                                existingComparison = true;
                              }
                            }
                            if(!existingComparison) {
                              masterCtrl.userComparisonArray.push(result.data[i]);
                            }
                          }
                        }
						
						console.log("Pop up modal window!");
						console.log(document.getElementById("loadComparison"));
						//document.getElementById("loadComparison").showModal();
						$("#loadComparison").modal("show");
						
		}, function(result){
			// error
		});
	}
	
	$scope.$on('loadIndex', function(event, index) {
		console.log("Index to load: " + index);
		loadComparison(masterCtrl.userComparisonArray[index]);
		masterCtrl.userComparisonArray = [];
	});
	
	function loadComparison(comparison) {
		console.log("Loading following comparison...");
		console.log(comparison);
		
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
		masterCtrl.rateComp = comparison;
		console.log(masterCtrl.rateComp);
		
		//first clear the page
		$rootScope.$broadcast('clearPage');
		
		//load the graphs
		$rootScope.$broadcast('loadGraphs');
		
		//next update the consumption graph
		$rootScope.$broadcast('setConsumptionForGraph', 0, "Consumption", masterCtrl.rateComp.energyUsage.consumption);
		
		//then update the cost time graph and update the pricingModel selection rows
		var length = masterCtrl.rateComp.rateBundle.length;
		for (var i=0; i<length; i++) {
			var bundle = masterCtrl.rateComp.rateBundle[i];
			
			var seriesID = bundle.id;
			var seriesLabel = bundle.pricingModel.ldc + ": " + bundle.pricingModel.rateType;
			var costData = bundle.cost;
			var totalCost = bundle.totalCost;
			
			$rootScope.$broadcast('newCostTimePM', seriesID,  seriesLabel, costData, totalCost);
			$rootScope.$broadcast('newPMSelectionRow', bundle.pricingModel);
		}
		
		//add a new selection row
		$rootScope.$broadcast('newRow');
	}
}
