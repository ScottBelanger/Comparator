angular.module('comparisonPage', [])
	.controller('comparisonController', function($scope, $http) {
		$scope.countryList = [];
		$scope.countrySelect = "";
		$scope.cityList = [];
		$scope.citySelect = "";
		$scope.ldcList = [];
		$scope.ldcSelect = "";
		$scope.rateList = [];
		$scope.rateSelect = "";
		
		$http.get('/countryList').then(function(result){
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
			
			$http.get('/cityList', { params: {country: $scope.countrySelect} } ).then(function(result){
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
			
			$http.get('/ldcList', { params: {city: $scope.citySelect} } ).then(function(result){
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
			
			$http.get('/rateList', { params: {city: $scope.citySelect,
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
	});