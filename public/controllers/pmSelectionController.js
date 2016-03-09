angular
	.module('comparisonPage')
	.controller('pmSelectionController', pmSelectionController); //this is where injection could occur

function pmSelectionController($scope, $http) {
	var selectCtrl = this;
	
	//for local
	var rateEngineURL = 'http://localhost:3001';
	//for remote
	//var rateEngineURL = 'website';
	
	selectCtrl.countryList = [];
	selectCtrl.countrySelect = "";
	selectCtrl.cityList = [];
	selectCtrl.citySelect = "";
	selectCtrl.ldcList = [];
	selectCtrl.ldcSelect = "";
	selectCtrl.rateList = [];
	selectCtrl.rateSelect = "";
	
	$http.get(rateEngineURL + '/getLDCCountries').then(function(result){
		console.log(result);
		selectCtrl.countryList = result.data;
	}, function(result){
		// error
	});
	
	selectCtrl.countrySelectChange = function() {
		console.log(selectCtrl.countrySelect);
		selectCtrl.cityList = [];
		selectCtrl.citySelect = "";
		selectCtrl.ldcList = [];
		selectCtrl.ldcSelect = "";
		selectCtrl.rateList = [];
		selectCtrl.rateSelect = "";
		
		$http.get(rateEngineURL + '/getCitiesInCountry', { params: {country: selectCtrl.countrySelect} } ).then(function(result){
		console.log(result);
		selectCtrl.cityList = result.data;
		}, function(result){
			// error
		});
	}
	
	selectCtrl.citySelectChange = function() {
		console.log(selectCtrl.citySelect);
		selectCtrl.ldcList = [];
		selectCtrl.ldcSelect = "";
		selectCtrl.rateList = [];
		selectCtrl.rateSelect = "";
		
		$http.get(rateEngineURL + '/getLDCsInCity', { params: {city: selectCtrl.citySelect} } ).then(function(result){
		console.log(result);
		selectCtrl.ldcList = result.data;
		}, function(result){
			// error
		});
	}
	
	selectCtrl.ldcSelectChange = function() {
		console.log(selectCtrl.countrySelect);
		console.log(selectCtrl.citySelect);
		console.log(selectCtrl.ldcSelect);
		selectCtrl.rateList = [];
		selectCtrl.rateSelect = "";
		
		$http.get(rateEngineURL + '/getRateTypesFromLDC', { params: {city: selectCtrl.citySelect,
																	 ldc: selectCtrl.ldcSelect} } 
		).then(function(result){
			console.log(result);
			selectCtrl.rateList = result.data;
			}, function(result){
				// error
		});
	}
	
	selectCtrl.rateSelectChange = function() {
		console.log(selectCtrl.countrySelect);
		console.log(selectCtrl.citySelect);
		console.log(selectCtrl.ldcSelect);
		console.log(selectCtrl.rateSelect);
	}
}