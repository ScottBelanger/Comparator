angular
	.module('rateEnginePage')
	.controller('reCSVController', reCSVController); //this is where injection could occur

function reCSVController($scope, $http) {
	var csvCtrl = this;
        csvCtrl.rateRows = [];
        csvCtrl.timeOfUseRows = [];
	
	csvCtrl.parseRateCSV = function() {
		console.log("Rate");
                var file = document.getElementById('uploadRateCSV').files[0];
                var reader = new FileReader();
                reader.onload = function() {
                  var lines = this.result.split('\n');
                  for(var line = 0; line < lines.length; line++) {
                    var csvs = lines[line].split('\ ');
                    csvCtrl.rateRows.push( { rateName: csvs[0], startDate: csvs[1], endDate: csvs[2], units: csvs[3], rateAmount: csvs[4]} );
                  }
                  $scope.$emit('RateRows', csvCtrl.rateRows);
                }
                reader.readAsText(file);
	};

	csvCtrl.parseRateTOUCSV = function() {
		console.log("TOU");
                var file = document.getElementById('uploadTOUCSV').files[0];
                var reader = new FileReader();
                reader.onload = function() {
                  var lines = this.result.split('\n');
                  for(var line = 0; line < lines.length; line++) {
                    var csvs = lines[line].split('\ ');
                    csvCtrl.rateRows.push( {rateName: csvs[0], startDate: csvs[1], endDate: csvs[2], peakLevel: csvs[3], startHour: csvs[4], endHour: csvs[5], units: csvs[6], rateAmount: csvs[7], isWeekend: csvs[8]} );
                  }
                  $scope.$emit('TOURows', csvCtrl.TOURows);
                }
                reader.readAsText(file);
	};
}
