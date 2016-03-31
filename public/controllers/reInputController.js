angular
	.module('rateEnginePage')
	.controller('reInputController', reInputController); //this is where injection could occur

function reInputController($scope, $http) {
	var reInptCtrl = this;
	
	reInptCtrl.country = "Canada";
	reInptCtrl.city = "London";
	reInptCtrl.ldc = "London Hydro";
	reInptCtrl.rateType = "Time Of Use";
	
	reInptCtrl.addPM = function() {
		console.log(reInptCtrl.country);
		console.log(reInptCtrl.city);
		console.log(reInptCtrl.ldc);
		console.log(reInptCtrl.rateType);
	}
}