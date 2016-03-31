angular
	.module('comparisonPage')
	.controller('csvDemandController', csvDemandController); //this is where injection could occur

function csvDemandController($scope) {
	var csvCtrl = this;
	csvCtrl.demandArray = [];
	
	csvCtrl.parseCSV = function() {

		console.log("in the demand controller");

		var file = document.getElementById('csvDemandFile').files[0];
		var reader = new FileReader();
		reader.onload = function() {

		  // By lines
		  var lines = this.result.split('\n');
		  for(var line = 5; line < lines.length; line++){
             if( lines[line] != undefined &&
                lines[line] != null &&
                lines[line] != " " &&
                lines[line] != "" ) 
             {
				var demand = {};
				var csvs = lines[line].split(',');
				for(var csv = 0; csv < csvs.length; csv++) {
				  if(csv == 0) {
					var ssvs = csvs[csv].split('\ ');
					demand.time = ssvs[0].replace(/\//g, "-") + " " + ssvs[1];
				  }
				  if(csv == 1) {
					demand.amount = parseFloat(csvs[csv]);
				  }
				}
				 csvCtrl.demandArray.push(demand);
		   	}
                  }
			$scope.$emit('newDemandArray', csvCtrl.demandArray);
		  }
		  reader.readAsText(file);
		}

	}
