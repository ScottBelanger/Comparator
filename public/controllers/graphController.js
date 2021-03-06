angular
	.module('comparisonPage')
	.controller('graphController', graphController); //this is where injection could occur
	
function graphController($scope) {
	var graphCtrl = this;
	var consumptionGraph;
	var costTimeGraph;
	var demandGraph;
	var pageType = localStorage.getItem('comparisonPage');
	
	$scope.$on('loadGraphs', function(event) {
		initializeGraphs();
	});
	
	$scope.$on('setConsumptionForGraph', function(event, seriesID, seriesName, consumptionData) {
		console.log("In setConsumptionForGraph");
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
		nav.setData(newSeries.data);
		consumptionGraph.xAxis[0].setExtremes();
	});

	$scope.$on('setDemandForGraph', function(event, seriesID, seriesName, demandData) {
		
		
		if (demandGraph.get(seriesID) != undefined) {
			demandGraph.get(seriesID).remove();
		}
		
		var demandPoints = [];
		
		var length = demandData.length;
		//populate the array for data with the consumption information
		for (var i=0; i<length; i++) {
			//put the date in the necessary format for Date parsing
			var date = demandData[i].time;
			var stringDate = date.replace(" ", "T").replace(":00", ":00:00");
			var x = Date.parse(stringDate);
			var y = demandData[i].amount;
			
			var point = [x, y];
			demandPoints.push(point);
		}
		
		var newSeries = {
			id: seriesID,
			name: seriesName,
			data: demandPoints,
			draggableY: true,
            rotation: 90
		};
		
		demandGraph.addSeries(newSeries);
		
		//needed for resetting a single consumption line
		var nav = demandGraph.get('navigator');
		nav.setData(newSeries.data);
		demandGraph.xAxis[0].setExtremes();
	});
	
	$scope.$on('newCostTimePM', function(event, seriesID, seriesName, costData, totalCost) {
		
		
		//TODO handle totalCost
		
		var costPoints = [];

		var length = costData.length;
		for (var i=0; i<length; i++) {
			//put the date in the necessary format for Date parsing
			var date = costData[i].time;
			var stringDate = date.replace(" ", "T").replace(":00", ":00:00");
			var x = Date.parse(stringDate);
			var y = costData[i].amount;
			
			
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
		
		costTimeGraph.get(id).remove();
	});
	
	$scope.$on('updateCostPoint', function(event, seriesID, costData, pointIndex) {
		
		
		var date = costData[0].time;
		var stringDate = date.replace(" ", "T").replace(":00", ":00:00");
		var x = Date.parse(stringDate);
		var y = costData[0].amount;
	
		
		var point = [x, y];
		
		
		costTimeGraph.get(seriesID).data[pointIndex].update(point);

		//update legend to update graph
		costTimeGraph.legend.render();
	});
	
	function pointConsumptionDrop(index, x, y) {
		
		
		//convert date back to string format
		var date = new Date(x);
		date = date.toISOString();  // example: 2016-02-21T14:00:00.000Z
		date = date.replace("T", " ").replace(":00.000Z", "");  //2016-02-21 14:00
		
		$scope.$emit('modifiedConsumptionPoint', index, date, y);
	}
	function pointDemandDrop(index, x, y) {
		
		
		//convert date back to string format
		var date = new Date(x);
		date = date.toISOString();  // example: 2016-02-21T14:00:00.000Z
		date = date.replace("T", " ").replace(":00.000Z", "");  //2016-02-21 14:00
		
		$scope.$emit('modifiedDemandPoint', index, date, y);
	}
	
	$scope.$on('clearPage', function(event) {

		if (consumptionGraph) {
			consumptionGraph.destroy();
		}
		if (costTimeGraph) {
			costTimeGraph.destroy();
		}
		if (demandGraph){
			demandGraph.destroy();
		}
	});

	$scope.$on('clearCostTime', function(event) {
		//consumptionGraph.destroy();
		costTimeGraph.destroy();
		initializeCostGraph();
	});
	function initializeCostGraph(){
		costTimeGraph = new Highcharts.StockChart({
          chart: {
            renderTo: 'CostTime',
            animation: false
          },
          legend: {
            enabled: true,
            borderColor: 'black',
            borderWidth: 2,
            shadow: true,
            labelFormatter: function() {
      		var total = 0;
      		for(var i=this.yData.length; i--;) { total += this.yData[i]; };
      			return "$"+Math.round(total*100)/100;
   			},
            title: {text:"Total Costs"}
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
	}

	function initializeGraphs() {
		console.log("initializeGraphs");
		consumptionGraph = new Highcharts.StockChart({
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
							
						},
						drop: function () {
							console.log("drop");
							pointConsumptionDrop(this.index, this.x, this.y);
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
		  tooltip: {
			  valueDecimals: 2
		  }
        });
		costTimeGraph = new Highcharts.StockChart({
          chart: {
            renderTo: 'CostTime',
            animation: false
          },
          legend: {
            enabled: true,
            borderColor: 'black',
            borderWidth: 2,
            shadow: true,
            labelFormatter: function() {
      		var total = 0;
      		for(var i=this.yData.length; i--;) { total += this.yData[i]; };
      			return "$" + Math.round(total*100)/100;
   			},
            title: {text:"Total Costs"}
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
		  tooltip: {
			  valueDecimals: 2
		  }
        });
		if (pageType === "commercial")
		{
			demandGraph = new Highcharts.StockChart({
	          chart: {
	            renderTo: 'demandGraph',
	            animation: false
	          },
	          title: {
	            text: 'Demand Time Graph'
	          },
			  yAxis: {
				title: {
					text: 'Demand (KW)'
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
							},
							drop: function () {
								console.log("demand drop");
								pointDemandDrop(this.index, this.x, this.y);
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
		}
	}
}