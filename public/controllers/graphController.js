angular.module('comparisonPage', [])
	.controller('graphController', function($scope, $http) {
		$scope.showGraphs = function() {
			document.getElementById("EnergyRateConsumption").style.visibility = "visible";
			document.getElementById("TimeCostGraph").style.visibility = "visible";
		}
	});