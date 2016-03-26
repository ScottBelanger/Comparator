angular
	.module('comparisonPage')
	.controller('xmlController', xmlController); //this is where injection could occur

function xmlController($scope) {
  var xmlCtrl = this;
  xmlCtrl.consumptionArray = [];
	
  xmlCtrl.parseXML = function() {
    var file = document.getElementById('xmlFile').files[0];
    var reader = new FileReader();
    reader.onload = function() {
      xmlDoc = $.parseXML(this.result);
      xml = $(xmlDoc);
      xml.find("IntervalReading").each(function() {
        value = null;
        time = null;
        $(this).find("value").each(function() {
          value = parseFloat($(this).text());
        });
        $(this).find("start").each(function() {
          tmptime = new Date($(this).text() * 1000);
          time = tmptime.getUTCFullYear() + "-" +
                 tmptime.getUTCMonth() + "-" + 
                 tmptime.getUTCDate() + " " +
                 tmptime.getUTCHours() + ":" +
                 tmptime.getUTCMinutes();
        });
        xmlCtrl.consumptionArray.push({time: time, amount: value}); 
      });

      $scope.emit('newConsumptionArray', xmlCtrl.consumptionArray);
    }

    reader.readAsText(file);
  };
}
