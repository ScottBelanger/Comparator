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
	
	function addNewSelectionRow() {
		rowCount++;
		pmCtrl.rows.push({index: rowCount});
	}
	
	$scope.$on('newPricingModel', function(event, pricingModel) {
		console.log("In pricingModelController after emit");
		console.log(pricingModel);
		
		//Add new pricing model to the pricingModelArray
		console.log("All pricing models:");
		pricingModelArray.push(pricingModel);
		console.log(pricingModelArray);
		
		addNewSelectionRow();
		
		//here a call needs to be made to the rate engine with pricing model info and usage info (json)
		//maybe need to emit the new pricing model to the rootScope so that it can send it to the rate engine
	});
}