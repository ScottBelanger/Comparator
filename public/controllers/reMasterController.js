angular
	.module('rateEnginePage')
	.controller('reMasterController', reMasterController); //this is where injection could occur

function reMasterController($scope, $rootScope, $http) {
	var mstrCtrl = this;
	
        $scope.$on('LDCid', function(event, id) {
          mstrCtrl.LDCid = id;
        });
}
