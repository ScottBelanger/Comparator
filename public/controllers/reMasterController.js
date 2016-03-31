angular
	.module('rateEnginePage')
	.controller('reMasterController', reMasterController); //this is where injection could occur

function reMasterController($scope, $rootScope, $http) {
	var mstrCtrl = this;
        mstrCtrl.RateRows = null;
        mstrCtrl.TOURows = null;
	
        $scope.$on('LDCid', function(event, id) {
          mstrCtrl.LDCid = id;
        });

        $scope.$on('RateRows', function(event, rows) {
          mstrCtrl.RateRows = rows;
          for(var i = 0; i < mstrCtrl.RateRows; i++) {
            mstrCtrl.RateRows[i].LDCid = mstrCtrl.LDCid;
          }
          if( mstrCtrl.RateRows != null && mstrCtrl.TOURows != null ) {
            //Post to server
            for(var i = 0; i < mstrCtrl.RateRows.length; i++) {
              $http.post('/addRates', object).then(function(){}, function(response) { console.log(response)});
            }
            for(var i = 0; i < mstrCtrl.TOU.length; i++) {
              $http.post('/addTimeOfUseRates', object).then(function(){}, function(response) { console.log(response)});
            }
          }
        });

        $scope.$on('TOURows', function(event, rows) {
          mstrCtrl.TOURows = rows;
          for(var i = 0; i < mstrCtrl.TOURows; i++) {
            mstrCtrl.TOURows[i].LDCid = mstrCtrl.LDCid;
          }
          if( mstrCtrl.RateRows != null && mstrCtrl.TOURows != null ) {
            //Post to server
            for(var i = 0; i < mstrCtrl.RateRows.length; i++) {
              $http.post('/addRates', object).then(function(){}, function(response) { console.log(response)});
            }
            for(var i = 0; i < mstrCtrl.TOU.length; i++) {
              $http.post('/addTimeOfUseRates', object).then(function(){}, function(response) { console.log(response)});
            }
          }
        });
}
