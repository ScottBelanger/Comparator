angular
	.module('rateEnginePage')
	.controller('reCSVController', reCSVController); //this is where injection could occur

function reCSVController($scope, $http) {
	var csvCtrl = this;
	
	csvCtrl.parseCSV = function() {
		console.log("parse stuff");
	}
}