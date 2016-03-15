var getComparisons = function(sessionID, sessionController) {
  return sessionController.getSession( sessionID )._user.getAllComparison();
};

var saveComparison = function(comparisonID, comparison, sessionController) {
	
};

var createComparison = function(comparison, sessionController) {
	
};

module.exports = {
	getComparisons : getComparisons,
	saveComparison : saveComparison,
	createComparison : createComparison
};