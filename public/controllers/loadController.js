angular
	.module('comparisonPage')
	.controller('loadController', loadController); //this is where injection could occur

function loadController($scope, $http) {
	var loadCtrl = this;
	$scope.comp = {
		index: 0
	}
	
	loadCtrl.setIndex = function() {
		console.log($scope.comp.index);
		$scope.$emit('loadIndex', $scope.comp.index);
	}
	
	loadCtrl.clearLoad = function() {
		$scope.masterCtrl.userComparisonArray = [];
		console.log("cleared");
		console.log($scope.masterCtrl.userComparisonArray);
	}
}