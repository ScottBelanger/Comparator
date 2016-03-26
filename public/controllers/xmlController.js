angular
	.module('comparisonPage')
	.controller('xmlController', xmlController); //this is where injection could occur

function xmlController($scope) {
  var xmlCtrl = this;
  xmlCtrl.consumptionArray = [];

  // Date Formatting stuff
  Number.prototype.padLeft = function(base,chr) {
    var len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
  };
	
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
          time = [ tmptime.getFullYear(),
                   (tmptime.getMonth()+1).padLeft(),
                   tmptime.getDate().padLeft()].join('-') +
                   ' ' +
                 [ tmptime.getHours().padLeft(),
                   tmptime.getMinutes().padLeft()].join(':');
        });
        xmlCtrl.consumptionArray.push({time: time, amount: value}); 
      });

      console.log(xmlCtrl.consumptionArray);
      $scope.$emit('newConsumptionArray', xmlCtrl.consumptionArray);
    }

    reader.readAsText(file);
  };
}
