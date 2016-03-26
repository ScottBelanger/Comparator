angular
	.module('comparisonPage')
	.controller('graphController', graphController); //this is where injection could occur
	
function graphController($scope) {
	var graphCtrl = this;
	//masterCtrl RateComparison which has many rateBundles
	
	var consumptionGraph = new Highcharts.StockChart({
          chart: {
            renderTo: 'EnergyRateConsumption',
            animation: false
          },
          title: {
            text: 'Consumption Time Graph'
          },
		  yAxis: {
			title: {
				text: 'Consumption (KWh)'
			}  
		  },
          plotOptions: {
            column: {
              stacking: 'normal'
            },
            line: {
              cursor: 'ns-resize'
            }
          },
		  navigator: {
			enabled: true,
			series: {
					id: 'navigator'
			}
		  },
		  rangeSelector: {
            buttons: [{
                count: 1,
                type: 'day',
                text: '1D'
            }, {
                count: 1,
                type: 'week',
                text: '1W'
            }, {
                count: 1,
                type: 'month',
                text: '1M'
            }, {
                count: 3,
                type: 'month',
                text: '3M'
            }, {
				count: 6,
                type: 'month',
                text: '6M'
            }, {
				count: 1,
                type: 'year',
                text: '1YR'
            }, {
				count: 3,
                type: 'year',
                text: '3YR'
            }, {
                type: 'all',
                text: 'All'
            }],
			inputEnabled: true,
			selected: 0
		  },
        });
		
		var costTimeGraph = new Highcharts.StockChart({
          chart: {
            renderTo: 'CostTime',
            animation: false
          },
          title: {
            text: 'Cost Time Graph'
          },
		   yAxis: {
			title: {
				//TODO: is this dollars or cents?
				text: 'Cost ($)'
			}  
		  },
          plotOptions: {
            
            column: {
              stacking: 'normal'
            },
            line: {
              cursor: 'ns-resize'
            }
          },
		  rangeSelector: {
            buttons: [{
                count: 1,
                type: 'day',
                text: '1D'
            }, {
                count: 1,
                type: 'week',
                text: '1W'
            }, {
                count: 1,
                type: 'month',
                text: '1M'
            }, {
                count: 3,
                type: 'month',
                text: '3M'
            }, {
				count: 6,
                type: 'month',
                text: '6M'
            }, {
				count: 1,
                type: 'year',
                text: '1YR'
            }, {
				count: 3,
                type: 'year',
                text: '3YR'
            }, {
                type: 'all',
                text: 'All'
            }],
			inputEnabled: true,
			selected: 0
		  },
        });
	
	$scope.$on('setConsumptionForGraph', function(event, seriesID, seriesName, consumptionData) {
		console.log("In graphController");
		console.log("initial consumption Data");
		console.log(consumptionData);
		
		if (consumptionGraph.get(seriesID) != undefined) {
			consumptionGraph.get(seriesID).remove();
		}
		
		var consumptionPoints = [];
		
		var length = consumptionData.length;
		//populate the array for data with the consumption information
		for (var i=0; i<length; i++) {
			//put the date in the necessary format for Date parsing
			var date = consumptionData[i].time;
			var stringDate = date.replace(" ", "T").replace(":00", ":00:00");
			var x = Date.parse(stringDate);
			var y = consumptionData[i].amount;
			
			//console.log("x: " + x);
			//console.log("y: " + y);
			
			var point = [x, y];
			consumptionPoints.push(point);
		}
		
		var newSeries = {
			id: seriesID,
			name: seriesName,
			data: consumptionPoints,
			draggableY: true,
            rotation: 90
		};
		
		consumptionGraph.addSeries(newSeries);
		
		//needed for resetting a single consumption line
		var nav = consumptionGraph.get('navigator');
		console.log(nav);
		nav.setData(newSeries.data);
		consumptionGraph.xAxis[0].setExtremes();
	});
	
	$scope.$on('updateCostTimePM', function(event, seriesID, seriesName, costData) {
		//console.log("In graphController updateCostTimePM");
		//console.log(seriesID);
		//console.log(seriesName);
		//console.log(costData);
		
		var costPoints = [];
		
		var length = costData.length;
		for (var i=0; i<length; i++) {
			//put the date in the necessary format for Date parsing
			var date = costData[i].time;
			var stringDate = date.replace(" ", "T").replace(":00", ":00:00");
			var x = Date.parse(stringDate);
			var y = costData[i].amount;
			
			//console.log("x: " + x);
			//console.log("y: " + y);
			
			var point = [x, y];
			costPoints.push(point);
		}
		
		costTimeGraph.addSeries({
			id: seriesID,
			name: seriesName,
			data: costPoints,
			draggableY: true,
            rotation: 90
		});
	});
	
	$scope.$on('removeCostSeries', function(event, id) {
		console.log("Made it to the graph controller with id: " + id);
		costTimeGraph.get(id).remove();
	});
}