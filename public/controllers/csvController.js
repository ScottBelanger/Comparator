angular
	.module('comparisonPage')
	.controller('csvController', csvController); //this is where injection could occur

function csvController($scope) {
	var csvCtrl = this;
	csvCtrl.consumptionArray = [];
	
	csvCtrl.parseCSV = function() {
		var file = document.getElementById('csvFile').files[0];
		var reader = new FileReader();
		reader.onload = function() {

		  // By lines
		  var lines = this.result.split('\n');
		  for(var line = 5; line < lines.length; line++){
                    if( lines[line] != undefined &&
                        lines[line] != null &&
                        lines[line] != " " &&
                        lines[line] != "" ) {
			var consumption = {};
			var csvs = lines[line].split(',');
			for(var csv = 0; csv < csvs.length; csv++) {
			  if(csv == 0) {
				var ssvs = csvs[csv].split('\ ');
				consumption.time = ssvs[0].replace(/\//g, "-") + " " + ssvs[1];
			  }
			  if(csv == 1) {
				consumption.amount = parseFloat(csvs[csv]);
			  }
			}
			 csvCtrl.consumptionArray.push(consumption);
		   }
                  }
			//console.log(csvCtrl.consumptionArray);
			$scope.$emit('newConsumptionArray', csvCtrl.consumptionArray);
		  }
		  reader.readAsText(file);
		}
	}
