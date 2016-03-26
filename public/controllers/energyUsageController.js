angular
	.module('comparisonPage')
	.controller('energyUsageController', energyUsageController); //this is where injection could occur

function energyUsageController($scope) {
	var euCtrl = this;
	
	euCtrl.setupManual = function() {
		//TODO: This logic will mess up the user if they had created a consumption before and then go to change it and then cancel
		//The graph will NOT change, but the values here do - maybe that won't be a problem
		euCtrl.date = "2016-02-21";
		euCtrl.consumptionArray = [{time: "00:00", amount: 0}, {time: "01:00", amount: 0}, {time: "02:00", amount: 0},
								   {time: "03:00", amount: 0}, {time: "04:00", amount: 0}, {time: "05:00", amount: 0}, 
								   {time: "06:00", amount: 0}, {time: "07:00", amount: 0}, {time: "08:00", amount: 0},
								   {time: "09:00", amount: 0}, {time: "10:00", amount: 0}, {time: "11:00", amount: 0},
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
		
		console.log("In manual usage");
		//need to send consumptionArray to comparison controller
		$scope.$emit('newConsumptionArray', euCtrl.consumptionArray);
	}
}