angular.module('comparisonPage', [])
	.controller('pricingModelController', function($scope, $http) {
		//for local
		var rateEngineURL = 'http://localhost:3001';
		//for remote
		//var rateEngineURL = 'website';
		
		var pricingModelArray = [];
		
		$scope.countryList = [];
		$scope.countrySelect = "";
		$scope.cityList = [];
		$scope.citySelect = "";
		$scope.ldcList = [];
		$scope.ldcSelect = "";
		$scope.rateList = [];
		$scope.rateSelect = "";
		
		$http.get(rateEngineURL + '/getLDCCountries').then(function(result){
			console.log(result);
			$scope.countryList = result.data;
		}, function(result){
			// error
		});
		
		$scope.countrySelectChange = function() {
			console.log($scope.countrySelect);
			$scope.cityList = [];
			$scope.citySelect = "";
			$scope.ldcList = [];
			$scope.ldcSelect = "";
			$scope.rateList = [];
			$scope.rateSelect = "";
			
			$http.get(rateEngineURL + '/getCitiesInCountry', { params: {country: $scope.countrySelect} } ).then(function(result){
			console.log(result);
			$scope.cityList = result.data;
			}, function(result){
				// error
			});
		}
		
		$scope.citySelectChange = function() {
			console.log($scope.citySelect);
			$scope.ldcList = [];
			$scope.ldcSelect = "";
			$scope.rateList = [];
			$scope.rateSelect = "";
			
			$http.get(rateEngineURL + '/getLDCsInCity', { params: {city: $scope.citySelect} } ).then(function(result){
			console.log(result);
			$scope.ldcList = result.data;
			}, function(result){
				// error
			});
		}
		
		$scope.ldcSelectChange = function() {
			console.log($scope.countrySelect);
			console.log($scope.citySelect);
			console.log($scope.ldcSelect);
			$scope.rateList = [];
			$scope.rateSelect = "";
			
			$http.get(rateEngineURL + '/getRateTypesFromLDC', { params: {city: $scope.citySelect,
																		 ldc: $scope.ldcSelect} } 
			).then(function(result){
				console.log(result);
				$scope.rateList = result.data;
				}, function(result){
					// error
			});
		}
		
		$scope.rateSelectChange = function() {
			console.log($scope.countrySelect);
			console.log($scope.citySelect);
			console.log($scope.ldcSelect);
			console.log($scope.rateSelect);
		}
		
		$scope.submitPricingModel = function() {
			//TODO: Either make submit unclickable or have an error message
			
			if ($scope.rateSelect == "") {
				console.log("Cannot submit without all fields selected.");
				return;
			}
			var pricingModel = {country: $scope.countrySelect,
								city: $scope.citySelect,
								ldc: $scope.ldcSelect,
								rateType: $scope.rateSelect};
			pricingModelArray.push(pricingModel);
			console.log(pricingModelArray);
			
			//here a call needs to be made to the rate engine with pricing model info and usage info (json)
			//maybe need to emit the new pricing model to the rootScope so that it can send it to the rate engine
		}
	  
	});