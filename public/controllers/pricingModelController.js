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
		//Add new pricing model to the pricingModelArray
		console.log("All pricing models:");
		pricingModelArray.push(pricingModel);
		console.log(pricingModelArray);
		
		addNewSelectionRow();
		
		//here a call needs to be made to the rate engine with pricing model info and usage info (json)
		//maybe need to emit the new pricing model to the rootScope so that it can send it to the rate engine
	});
	
	$scope.$on('deletePricingModel', function(event, row) {
		//search through pricing model array for the id to match the row index
		//remove both the pricing model with that id and the row from the rows array
		var length = pricingModelArray.length;
		for (var i=0; i<length; i++) {
			if (pricingModelArray[i].id == row) {
				pricingModelArray.splice(i,1);
				pmCtrl.rows.splice(i,1);
				return;
			}
		}
	});
}