angular
	.module('comparisonPage')
	.controller('loadController', loadController); //this is where injection could occur

function loadController($scope, $http) {
	var loadCtrl = this;
	$scope.comp = {
		index: 0
	}
	 /* $scope.color = {
        name: 'blue'
      }; */
	
	loadCtrl.setIndex = function() {
		console.log($scope.comp.index);
		//console.log($scope.color.name);
		$scope.$emit('loadIndex', $scope.comp.index);
	}
}