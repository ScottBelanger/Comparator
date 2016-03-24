var xmlhttp = new XMLHttpRequest();
var url = "/espi/1_1/resource/Subscription/{subscriptionId}/UsagePoint/{usagePointId}/ElectricPowerUsageSummary";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = JSON.parse(xmlhttp.responseText);
        console.log(myArr)
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

angular.module('comparisonPage', []);