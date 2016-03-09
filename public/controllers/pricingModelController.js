angular
	.module('comparisonPage')
	.controller('pricingModelController', pricingModelController); //this is where injection could occur

function pricingModelController($scope, $http) {
	var pmCtrl = this;
	
	pmCtrl.columnLabels = [{title: "Country"}, {title: "City"}, {title: "LDC"}, {title: "Rate Type"}];
	
	pmCtrl.rows = [];
	var rowCount = 0;
	pmCtrl.rows.push({index: rowCount});
	
	var pricingModelArray = [];
	
	pmCtrl.submitPricingModel = function() {
		//TODO: Either make submit unclickable or have an error message
		
		/* if ($scope.rateSelect == "") {
			console.log("Cannot submit without all fields selected.");
			return;
		} */
		
		
		/* var pricingModel = {country: $scope.countrySelect,
							city: $scope.citySelect,
							ldc: $scope.ldcSelect,
							rateType: $scope.rateSelect};
		pricingModelArray.push(pricingModel);
		console.log(pricingModelArray); */
		
		rowCount++;
		pmCtrl.rows.push({index: rowCount});
		
		//here a call needs to be made to the rate engine with pricing model info and usage info (json)
		//maybe need to emit the new pricing model to the rootScope so that it can send it to the rate engine
	}
}