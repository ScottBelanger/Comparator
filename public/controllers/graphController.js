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
            },
			series: {
				point: {
					events: {
						drag: function (e) {
							//console.log("drag");
							//console.log(e);
						},
						drop: function () {
							console.log("drop");
							//console.log(this.series.name);
							//console.log(this.x);
							//console.log(this.y);
							//console.log(this);
							consumptionPointDrop(this.index, this.x, this.y);
						}
					}
				}
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
		//console.log("In graphController");
		//console.log("initial consumption Data");
		//console.log(consumptionData);
		
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
		//console.log(nav);
		nav.setData(newSeries.data);
		consumptionGraph.xAxis[0].setExtremes();
	});
	
	$scope.$on('newCostTimePM', function(event, seriesID, seriesName, costData, totalCost) {
		//console.log("In graphController updateCostTimePM");
		//console.log(seriesID);
		//console.log(seriesName);
		//console.log(costData);
		
		//TODO handle totalCost
		
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
            rotation: 90
		});
	});
	
	$scope.$on('removeCostSeries', function(event, id) {
		//console.log("Made it to the graph controller with id: " + id);
		costTimeGraph.get(id).remove();
	});
	
	$scope.$on('updateCostPoint', function(event, seriesID, costData, pointIndex) {
		//console.log("graphController");
		//console.log(seriesID);
		//console.log(costData);
		//console.log(pointIndex);
		
		var date = costData[0].time;
		var stringDate = date.replace(" ", "T").replace(":00", ":00:00");
		var x = Date.parse(stringDate);
		var y = costData[0].amount;
		
		//console.log("x: " + x);
		//console.log("y: " + y);
		
		var point = [x, y];
		
		costTimeGraph.get(seriesID).data[pointIndex].update(point);
	});
	
	function consumptionPointDrop(index, x, y) {
		//console.log("In drop funtion");
		//console.log(x);
		//console.log(y);
		//console.log(index);
		
		//convert date back to string format
		var date = new Date(x);
		date = date.toISOString();  // example: 2016-02-21T14:00:00.000Z
		date = date.replace("T", " ").replace(":00.000Z", "");  //2016-02-21 14:00
		//console.log("date: " + date);
		
		$scope.$emit('modifiedConsumptionPoint', index, date, y);
	}
}