angular
	.module('comparisonPage')
	.controller('pricingModelController', pricingModelController); //this is where injection could occur

function pricingModelController($scope) {
	var pmCtrl = this;
	var rowCount;
	
	$scope.$on('loadRows', function(event) {
		initializeRows();
	});
	
	function initializeRows() {
		pmCtrl.columnLabels = [{title: "Country"}, {title: "City"}, {title: "LDC"}, {title: "Rate Type"}];
		pmCtrl.rows = [];
		rowCount = 0;
		addNewSelectionRow();
	}
	
	function addNewSelectionRow() {
		//INDEX MUST MATCH PRICINGMODEL ID!!!
		//console.log("addNewSelectionRow");
		//console.log("rowCount: " + rowCount);
		pmCtrl.rows.push({index: rowCount});
		console.log(pmCtrl.rows);
		rowCount++;
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
	
	$scope.$on('clearPage', function(event) {
		pmCtrl.rows = [];
	});
	
	$scope.$on('newRow', function(event) {
		addNewSelectionRow();
	});
	
	$scope.$on('newPMSelectionRow', function(event, pricingModel) {
		console.log("In newPMSelectionRow");
		rowCount = pricingModel.id;
		addNewSelectionRow();
	});
}