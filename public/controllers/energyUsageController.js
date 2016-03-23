angular
	.module('comparisonPage')
	.controller('energyUsageController', energyUsageController); //this is where injection could occur

function energyUsageController($scope) {
	var euCtrl = this;
	var date = "2014-01-01";
	euCtrl.consumptionArray = [{time: date + " 0:00", amount: 0}, {time: date + " 1:00", amount: 0}, {time: date + " 2:00", amount: 0},
							   {time: date + " 3:00", amount: 0}, {time: date + " 4:00", amount: 0}, {time: date + " 5:00", amount: 0}, 
							   {time: date + " 6:00", amount: 0}, {time: date + " 7:00", amount: 0}, {time: date + " 8:00", amount: 0},
							   {time: date + " 9:00", amount: 0}, {time: date + " 10:00", amount: 0}, {time: date + " 11:00", amount: 0},
							   {time: date + " 12:00", amount: 0}, {time: date + " 13:00", amount: 0}, {time: date + " 14:00", amount: 0},
							   {time: date + " 15:00", amount: 0}, {time: date + " 16:00", amount: 0}, {time: date + " 17:00", amount: 0},
							   {time: date + " 18:00", amount: 0}, {time: date + " 19:00", amount: 0}, {time: date + " 20:00", amount: 0},
							   {time: date + " 21:00", amount: 0}, {time: date + " 22:00", amount: 0}, {time: date + " 23:00", amount: 0}];
							  
	euCtrl.consumptionValue = [];
	
	euCtrl.submitDaily = function() {
		//console.log(euCtrl.consumptionArray);
		//need to send consumptionArray to comparison controller
		$scope.$emit('newConsumptionArray', euCtrl.consumptionArray);
	}
}