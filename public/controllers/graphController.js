angular
	.module('comparisonPage')
	.controller('graphController', graphController); //this is where injection could occur
	
function graphController($scope) {
	var graphCtrl = this;
	//masterCtrl RateComparison which has many rateBundles
	
	var consumptionGraph = new Highcharts.Chart({
          chart: {
            renderTo: 'EnergyRateConsumption',
            animation: false
          },
          title: {
            text: 'Energy Rate Consumption'
          },
          xAxis: {
            categories: ['a', 'b', 'c', 'd']
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            },
            line: {
              cursor: 'ns-resize'
            }
          },
          tooltip: {
            yDecimals: 2
          },
          series: [{
            data: [1, 2, 3, 4],
            draggableY: true,
            rotation: 90
          }]
        });
		
		var costTimeGraph = new Highcharts.Chart({
          chart: {
            renderTo: 'CostTime',
            animation: false
          },
          title: {
            text: 'Cost Time Graph'
          },
          xAxis: {
            categories: []
          },
          plotOptions: {
            
            column: {
              stacking: 'normal'
            },
            line: {
              cursor: 'ns-resize'
            }
          },
          tooltip: {
            yDecimals: 2
          },
          series: []
        });
	
	$scope.$on('consumptionForGraph', function(event, consumptionPoints) {
		console.log("In graphController");
		console.log(consumptionPoints);
		console.log(consumptionGraph.xAxis[0]);
		console.log(consumptionGraph.series[0]);
		
		var consumptionTimes = [];
		var consumptionValues = [];
		
		var length = consumptionPoints.length;
		for (var i=0; i<length; i++) {
			consumptionTimes.push(consumptionPoints[i].time);
			consumptionValues.push(consumptionPoints[i].amount);
		}
		
		consumptionGraph.xAxis[0].setCategories(consumptionTimes, false);
		consumptionGraph.series[0].setData(consumptionValues);
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