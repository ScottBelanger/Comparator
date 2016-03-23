angular
	.module('comparisonPage')
	.controller('pricingModelController', pricingModelController); //this is where injection could occur

function pricingModelController($scope) {
	var pmCtrl = this;
	
	pmCtrl.columnLabels = [{title: "Country"}, {title: "City"}, {title: "LDC"}, {title: "Rate Type"}];
	
	pmCtrl.rows = [];
	var rowCount = 0;
	pmCtrl.rows.push({index: rowCount});
	
	function addNewSelectionRow() {
		rowCount++;
		pmCtrl.rows.push({index: rowCount});
	}
	
	$scope.$on('newPricingModel', function(event, pricingModel) {
		addNewSelectionRow();
	});
	
	$scope.$on('deletePricingModel', function(event, row) {
		//search through row array to find the index that matches the passed in row number and remove that row from the array
		var length = pmCtrl.rows.length;
		for (var i=0; i<length; i++) {
			if (pmCtrl.rows[i].index == row) {
				pmCtrl.rows.splice(i,1);
				return;
			}
		}
	});
}