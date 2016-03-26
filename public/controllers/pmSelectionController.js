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
	
	$http.get(rateEngineURL + '/getLDCCountries').then(function(result){
		selectCtrl.countryList = result.data;
	}, function(result){
		// error
	});
	
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
			submitPricingModel();
		}
		else {
			deletePricingModel();
		}
	}
	
	function submitPricingModel() {
		//TODO: Either make submit unclickable or have an error message
		
		if (selectCtrl.rateSelect == "") {
			console.log("Cannot submit without all fields selected.");
			return;
		}
		
		selectCtrl.btnName = "Delete";
		
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
}