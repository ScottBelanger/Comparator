angular
	.module('comparisonPage')
	.controller('pmSelectionController', pmSelectionController); //this is where injection could occur

function pmSelectionController($scope, $http) {
	var selectCtrl = this;
	//for local
	var rateEngineURL = 'http://localhost:3001';
	//for remote
	//var rateEngineURL = 'http://rateeng-env.us-west-2.elasticbeanstalk.com';
	
	selectCtrl.countryList = [];
	selectCtrl.countrySelect = "";
	selectCtrl.cityList = [];
	selectCtrl.citySelect = "";
	selectCtrl.ldcList = [];
	selectCtrl.ldcSelect = "";
	selectCtrl.rateList = [];
	selectCtrl.rateSelect = "";
	selectCtrl.btnName = "Calculate";
	
	if ($scope.masterCtrl.rateComp.rateBundle[$scope.$index] != undefined) {
		selectCtrl.isLoaded = true;
	}
	else {
		selectCtrl.isLoaded = false;
	}
	
	if (selectCtrl.isLoaded) {
		//console.log("rateBundle");
		//console.log($scope.masterCtrl.rateComp.rateBundle[$scope.$index]);
		var pm = $scope.masterCtrl.rateComp.rateBundle[$scope.$index].pricingModel;
		
		selectCtrl.btnName = "Delete";
		selectCtrl.loadedCountry = pm.country;
		selectCtrl.loadedCity = pm.city;
		selectCtrl.loadedLDC = pm.ldc;
		selectCtrl.loadedRateType = pm.rateType;
	}
	else {
		$http.get(rateEngineURL + '/getLDCCountries').then(function(result){
			selectCtrl.countryList = result.data;
		}, function(result){
			// error
		});
	}
	
	selectCtrl.countrySelectChange = function() {
		//clear all fields below this one
		selectCtrl.cityList = [];
		selectCtrl.citySelect = "";
		selectCtrl.ldcList = [];
		selectCtrl.ldcSelect = "";
		selectCtrl.rateList = [];
		selectCtrl.rateSelect = "";
		
		$http.get(rateEngineURL + '/getCitiesInCountry', { params: {country: selectCtrl.countrySelect} } ).then(function(result){
			selectCtrl.cityList = result.data;
		}, function(result){
			// error
		});
	}
	
	selectCtrl.citySelectChange = function() {
		//clear all fields below this one
		selectCtrl.ldcList = [];
		selectCtrl.ldcSelect = "";
		selectCtrl.rateList = [];
		selectCtrl.rateSelect = "";
		
		$http.get(rateEngineURL + '/getLDCsInCity', { params: {city: selectCtrl.citySelect} } ).then(function(result){
			selectCtrl.ldcList = result.data;
		}, function(result){
			// error
		});
	}
	
	selectCtrl.ldcSelectChange = function() {
		//clear all fields below this one
		selectCtrl.rateList = [];
		selectCtrl.rateSelect = "";
		
		$http.get(rateEngineURL + '/getRateTypesFromLDC', { params: {city: selectCtrl.citySelect,
																	 ldc: selectCtrl.ldcSelect} } 
		).then(function(result){
			selectCtrl.rateList = result.data;
			}, function(result){
				// error
		});
	}
	
	//This function may not be necessary
	selectCtrl.rateSelectChange = function() {
		//console.log(selectCtrl.rateSelect);
	}
	
	selectCtrl.pmRowClick = function() {
		if (selectCtrl.btnName == "Calculate") {
			if (selectCtrl.rateSelect == "") {
				alert("Cannot submit without all fields selected!");
				return;
			}
			if ($scope.masterCtrl.rateComp.energyUsage.consumption.length == 0) {
				alert("Need consumption to calculate!");
				return;
			}
			
			//console.log($scope.masterCtrl.rateComp.energyUsage.consumption);
			
			submitPricingModel();
			setValues();
		}
		else {
			deletePricingModel();
		}
	}
	
	function submitPricingModel() {
		//TODO: Either make submit unclickable or have an error message
		console.log("submitPricingModel");
		console.log("index: " + $scope.row.index);
		
		var pricingModel = {id: $scope.row.index,
							country: selectCtrl.countrySelect,
							city: selectCtrl.citySelect,
							ldc: selectCtrl.ldcSelect,
							rateType: selectCtrl.rateSelect};
		
		
		$scope.$emit('newPricingModel', pricingModel);
	}
	
	function deletePricingModel() {
		$scope.$emit('deletePricingModel', $scope.row.index);
	}
	
	//This function will set the values permanently in the row
	function setValues() {
		selectCtrl.btnName = "Delete";
		selectCtrl.loadedCountry = selectCtrl.countrySelect;
		selectCtrl.loadedCity = selectCtrl.citySelect;
		selectCtrl.loadedLDC = selectCtrl.ldcSelect;
		selectCtrl.loadedRateType = selectCtrl.rateSelect;
		selectCtrl.isLoaded = true;
	}
}