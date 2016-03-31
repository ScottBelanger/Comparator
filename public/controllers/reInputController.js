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
                if(reInptCtrl.country == "" || reInptCtrl.country == " " ||
                  reInptCtrl.city == "" || reInptCtrl.city == " " ||
                  reInptCtrl.ldc == "" || reInptCtrl.ldc == " " ||
                  reInptCtrl.rateType == "" || reInptCtrl.rateType == " ") {
                alert("Missing input, please fill in all boxes");
                } else {
                  $http.post('/addLDC', 
                      { companyName: reInptCtrl.ldc, country: reInptCtrl.country, city: reInptCtrl.city, rateType: reInptCtrl.rateType}).then(function(response) {
                        $scope.$emit('LDCid', response);
                      }, function(response) {
                           console.log(response);
                         });
                }
                   
	}
}
