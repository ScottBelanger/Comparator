angular.module('comparisonPage', [])
	.controller('formController', function($scope, $http) {
		//for local
		var rateEngineURL = 'http://localhost:3001';
		//for remote
		//var rateEngineURL = 'website';
		
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
			console.log($scope.rateSelect);
		}
		
		$scope.calculateCost = function() {
			console.log("In calculateCost function");
			
			//here a call needs to be made to the rate engine with pricing model info and usage info (json)
		}
	  
	});