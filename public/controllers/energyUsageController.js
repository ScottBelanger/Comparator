angular
	.module('comparisonPage')
	.controller('energyUsageController', energyUsageController); //this is where injection could occur

function energyUsageController($scope) {
	var euCtrl = this;
	
	euCtrl.setupManual = function() {
		//TODO: This logic will mess up the user if they had created a consumption before and then go to change it and then cancel
		//The graph will NOT change, but the values here do - maybe that won't be a problem
		euCtrl.date = "2016-02-21";
		euCtrl.consumptionArray = [{time: "0:00", amount: 0}, {time: "1:00", amount: 0}, {time: "2:00", amount: 0},
								   {time: "3:00", amount: 0}, {time: "4:00", amount: 0}, {time: "5:00", amount: 0}, 
								   {time: "6:00", amount: 0}, {time: "7:00", amount: 0}, {time: "8:00", amount: 0},
								   {time: "9:00", amount: 0}, {time: "10:00", amount: 0}, {time: "11:00", amount: 0},
								   {time: "12:00", amount: 0}, {time: "13:00", amount: 0}, {time: "14:00", amount: 0},
								   {time: "15:00", amount: 0}, {time: "16:00", amount: 0}, {time: "17:00", amount: 0},
								   {time: "18:00", amount: 0}, {time: "19:00", amount: 0}, {time: "20:00", amount: 0},
								   {time: "21:00", amount: 0}, {time: "22:00", amount: 0}, {time: "23:00", amount: 0}];
	}
	
	euCtrl.submitUsage = function() {
		console.log(euCtrl.consumptionArray);
		
		var length = euCtrl.consumptionArray.length;
		for (var i=0; i<length; i++) {
			euCtrl.consumptionArray[i].time = euCtrl.date + " " + euCtrl.consumptionArray[i].time;
		}
		
		//need to send consumptionArray to comparison controller
		$scope.$emit('newConsumptionArray', euCtrl.consumptionArray);
	}
}