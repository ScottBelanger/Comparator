function getCountryList(callback) {
	//var countryList = API call to Rate Engine
	callback(countryList);
}

function getCityList(country, callback) {
	//var cityList = API call to Rate Engine
	callback(cityList);
}

function getLDCList(city, callback) {
	//var countryList = API call to Rate Engine
	callback(countryList);
}

function getRateList(city, ldc, callback) {
	//var cityList = API call to Rate Engine
	callback(cityList);
}

function getCountryListStub(callback) {
	var countryList = ["Canada", "China", "United States"];
	callback(countryList);
}

function getCityListStub(country, callback) {
	var cityList = [];
	switch(country) {
		case "Canada":
			cityList = ["Calgary", "Kingston", "London", "Sarnia"];
			break;
		case "China":
			cityList = ["Beijing", "Shanghai"];
			break;
		case "United States":
			cityList = ["Chicago", "Houston", "New York"];
			break;
		default:
			cityList = ["Default"];
	}
	callback(cityList);
}

function getLDCListStub(city, callback) {
	var ldcList = [];
	switch(city) {
		case "London":
			ldcList = ["London Hydro"];
			break;
		case "New York":
			ldcList = ["NY Power", "Big Apple Power"];
			break;
		case "Shanghai":
			ldcList = ["Company 1", "Company 2", "Company 3"];
			break;
		default:
			ldcList = ["Default"];
	}
	callback(ldcList);
}

function getRateListStub(city, ldc, callback) {
	var rateList = [];
	switch(ldc) {
		case "London Hydro":
			rateList = ["Spot Market", "Tiered", "Time of Use"];
			break;
		case "Big Apple Power":
			rateList = ["Tiered", "Time of Use"];
			break;
		case "Company 1":
			rateList = ["Time of Use"];
			break;
		default:
			rateList = ["Default"];
	}
	callback(rateList);
}

module.exports = {
	//Stubs
	getCountryList: getCountryListStub,
	getCityList: getCityListStub,
	getLDCList: getLDCListStub,
	getRateList: getRateListStub
	
	//Real functions
	/* 
	getCountryList: getCountryList,
	getCityList: getCityList,
	getLDCList: getLDCList,
	getRateList: getRateList
	*/
}
