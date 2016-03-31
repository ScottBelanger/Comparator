angular
	.module('rateEnginePage')
	.controller('reCSVController', reCSVController); //this is where injection could occur

function reCSVController($scope, $http) {
	var csvCtrl = this;
        csvCtrl.rates = [];
        csvCtrl.timeOfUse = [];
	
	csvCtrl.parseCSV = function() {
		console.log("parse stuff");
                $scope.$emit('parsedCSV', );
	}
}
