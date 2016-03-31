angular
	.module('comparisonPage')
	.controller('compSelectController', compSelectController); //this is where injection could occur

function compSelectController($scope, $http) {
	var compSelCtrl = this;
	$scope.comp = {
		select: 0
	}
	
	compSelCtrl.submitSelection = function() {
		console.log("compSelCtrl");
		console.log($scope.comp.select);
		$scope.$emit('setCompType', $scope.comp.select);
	}
}