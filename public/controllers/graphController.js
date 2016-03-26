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
            text: 'Energy Rate Consumption'
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
			inputEnabled: false,
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
			inputEnabled: false,
			selected: 0
		  },
        });
	
	$scope.$on('consumptionForGraph', function(event, consumptionData) {
		console.log("In graphController");
		console.log("initial consumption Data");
		console.log(consumptionData);
		
		var consumptionPoints = [];
		
		var length = consumptionData.length;
		//populate the array for data with the consumption information
		for (var i=0; i<length; i++) {
			//put the date in the necessary format for Date parsing
			var date = consumptionData[i].time;
			var stringDate = date.replace(" ", "T").replace(":00", ":00:00");
			var x = Date.parse(stringDate);
			var y = consumptionData[i].amount;
			
			console.log("x: " + x);
			console.log("y: " + y);
			
			var point = [x, y];
			consumptionPoints.push(point);
		}
		
		consumptionGraph.addSeries({
			id: 1,
			name: 'consumption',
			data: consumptionPoints,
			draggableY: true,
            rotation: 90
		});
	});
	
	$scope.$on('updateCostTimePM', function(event, seriesName, costPoints) {
		console.log("In graphController updateCostTimePM");
		console.log(seriesName);
		console.log(costPoints);
		
		var costTimes = [];
		var costValues = [];
		
		var length = costPoints.length;
		for (var i=0; i<length; i++) {
			costTimes.push(costPoints[i].time);
			costValues.push(costPoints[i].amount);
		}
		
		//TODO: This needs to be fixed so that it is not called all the time
		costTimeGraph.xAxis[0].setCategories(costTimes, false);
		
		costTimeGraph.addSeries({
			name: seriesName,
			data: costValues,
			draggableY: true,
            rotation: 90
		});
	});
}