import mongoose from "mongoose";
import axios from "axios";
//FOR OFFICIAL AMKTRAK import protobuf from "protobufjs";
import { parseString } from "xml2js";


import { liveModel } from "../models/live.model.js";

const VIARAIL_URL = "https://tsimobile.viarail.ca/data/allData.json";
const GO_BARRIE_URL = "https://www.gotracker.ca/GOTracker/web/GODataAPIProxy.svc/TripLocation/Service/Lang/65/en";
const GO_KITCHENER_URL = "https://www.gotracker.ca/GoTracker/web/GODataAPIProxy.svc/TripLocation/Service/Lang/31/en";
const GO_LAKESHORE_EAST_URL = "https://www.gotracker.ca/GOTracker/web/GODataAPIProxy.svc/TripLocation/Service/Lang/09/en";
const GO_LAKESHORE_WEST_URL = "https://www.gotracker.ca/GOTracker/web/GODataAPIProxy.svc/TripLocation/Service/Lang/01/en";
const GO_MILTON_URL = "https://www.gotracker.ca/GOTracker/web/GODataAPIProxy.svc/TripLocation/Service/Lang/21/en";
const GO_RICHMOND_HILL_URL = "https://www.gotracker.ca/GoTracker/web/GODataAPIProxy.svc/TripLocation/Service/Lang/61/en";
const GO_STOUFFVILLE_URL = "https://www.gotracker.ca/GOTracker/web/GODataAPIProxy.svc/TripLocation/Service/Lang/71/en";
//OFFICIAL const AMTRAK_URL = "https://maps.amtrak.com/services/MapDataService/trains/getTrainsData";
const AMTRAK_URL = "https://api-v3.amtraker.com/v3/trains";

export const getLive = async (req, res) => {
	try {
		const live = await liveModel.find();
		res.status(200).json(live);
	} catch (error) {
		console.error("Error in the getLive controller: ", error.message);
		res.status(404).json({ message: error.message });
	}
};

export const setLive = async (trains, operator) => {
	try {
		await liveModel.deleteMany({ operator : operator }).then(function() {
			liveModel.insertMany(trains).lean;
		});
	} catch (error) {
		console.error("Error in the setLive controller: ", error.message);
	}
};

export const getVia = async () => {
	try {
		const res = await axios.get(VIARAIL_URL);
		var trains = [];

		Object.keys(res.data).forEach(function(key,index) {
			if (res.data[key].hasOwnProperty("lat") && res.data[key].hasOwnProperty("lng")) {
				let train = {
					operator: "via",
					id: key,
					position: {
						lat: res.data[key].lat,
						lon: res.data[key].lng
					},
					delay: "",
					timestamp: res.data[key].poll,
					origin: res.data[key].from,
					destination: res.data[key].to
				}
				trains.push(train);
			}
		});

		setLive(trains, "via");
		console.log(`✅ VIA Rail live data updated: ${trains.length} trains`);
	} catch (error) {
		console.error("❌ Failed to fetch VIA Rail live data:", error.message);
	}
};

export const getGo = async () => {
	try {
		var trains = [];

	await axios.get(GO_BARRIE_URL).then((res) => {
		parseString(res.data, function (err, result) {
			if (result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic) {
			Object.keys(result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic).forEach(function(key,index) {
				var data = result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic[key]["$"];
				let train = {
					operator: "go",
					id: data.TripNumber,
					position: {
						lat: data.Latitude,
						lon: data.Longitude
					},
					delay: data.DelayMinute,
					timestamp: data.ModifiedDate,
					origin: data.StartStation,
					destination: data.EndStation
				}
				trains.push(train);
			});
			}
		});


	});

	
	await axios.get(GO_KITCHENER_URL).then((res) => {
		parseString(res.data, function (err, result) {	
			if (result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic) {
			Object.keys(result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic).forEach(function(key,index) {
				var data = result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic[key]["$"];
				let train = {
					operator: "go",
					id: data.TripNumber,
					position: {
						lat: data.Latitude,
						lon: data.Longitude
					},
					delay: data.DelayMinute,
					timestamp: data.ModifiedDate,
					origin: data.StartStation,
					destination: data.EndStation
				}
				trains.push(train);
			});
			}
		});


	});

	await axios.get(GO_LAKESHORE_EAST_URL).then((res) => {
		parseString(res.data, function (err, result) {
			if (result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic) {
			Object.keys(result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic).forEach(function(key,index) {
				var data = result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic[key]["$"];
				let train = {
					operator: "go",
					id: data.TripNumber,
					position: {
						lat: data.Latitude,
						lon: data.Longitude
					},
					delay: data.DelayMinute,
					timestamp: data.ModifiedDate,
					origin: data.StartStation,
					destination: data.EndStation
				}
				trains.push(train);
			});
			}
		});


	});

	await axios.get(GO_LAKESHORE_WEST_URL).then((res) => {
		parseString(res.data, function (err, result) {
						if (result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic) {
			Object.keys(result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic).forEach(function(key,index) {
				var data = result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic[key]["$"];
				let train = {
					operator: "go",
					id: data.TripNumber,
					position: {
						lat: data.Latitude,
						lon: data.Longitude
					},
					delay: data.DelayMinute,
					timestamp: data.ModifiedDate,
					origin: data.StartStation,
					destination: data.EndStation
				}
				trains.push(train);
			});
			}
		});


	});

	await axios.get(GO_MILTON_URL).then((res) => {
		parseString(res.data, function (err, result) {
						if (result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic) {
			Object.keys(result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic).forEach(function(key,index) {
				var data = result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic[key]["$"];
				let train = {
					operator: "go",
					id: data.TripNumber,
					position: {
						lat: data.Latitude,
						lon: data.Longitude
					},
					delay: data.DelayMinute,
					timestamp: data.ModifiedDate,
					origin: data.StartStation,
					destination: data.EndStation
				}
				trains.push(train);
			});
			}
		});


	});

	await axios.get(GO_RICHMOND_HILL_URL).then((res) => {
		parseString(res.data, function (err, result) {
						if (result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic) {
			Object.keys(result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic).forEach(function(key,index) {
				var data = result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic[key]["$"];
				let train = {
					operator: "go",
					id: data.TripNumber,
					position: {
						lat: data.Latitude,
						lon: data.Longitude
					},
					delay: data.DelayMinute,
					timestamp: data.ModifiedDate,
					origin: data.StartStation,
					destination: data.EndStation
				}
				trains.push(train);
			});
			}
		});


	});

	await axios.get(GO_STOUFFVILLE_URL).then((res) => {
		parseString(res.data, function (err, result) {
						if (result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic) {
			Object.keys(result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic).forEach(function(key,index) {
				var data = result.ReturnValueOfListOfInServiceTripPublic.Data[0].InServiceTripPublic[key]["$"];
				let train = {
					operator: "go",
					id: data.TripNumber,
					position: {
						lat: data.Latitude,
						lon: data.Longitude
					},
					delay: data.DelayMinute,
					timestamp: data.ModifiedDate,
					origin: data.StartStation,
					destination: data.EndStation
				}
				trains.push(train);
			});
			}
		});


	});

		setLive(trains, "go");
		console.log(`✅ GO Transit live data updated: ${trains.length} trains`);
	} catch (error) {
		console.error("❌ Failed to fetch GO Transit live data:", error.message);
	}
};

export const getAmtrak = async () => {
	try {
		const res = await axios.get(AMTRAK_URL);

		var trains = [];

		Object.keys(res.data).forEach(function(key,index) {
			Object.keys(res.data[key]).forEach(function(subkey,index) {
				let train = {
					operator: "amtrak",
					id: res.data[key][subkey].trainID,
					position: {
						lat: res.data[key][subkey].lat,
						lon: res.data[key][subkey].lon
					},
					delay: "",
					timestamp: res.data[key][subkey].updatedAt,
					origin: res.data[key][subkey].origName,
					destination: res.data[key][subkey].destName
				}
				trains.push(train);
			})
		});

		setLive(trains, "amtrak");
		console.log(`✅ Amtrak live data updated: ${trains.length} trains`);
	} catch (error) {
		console.error("❌ Failed to fetch Amtrak live data:", error.message);
	}
};

// Auto-fetch live data on server start and every 60 seconds
// Now with error handling - won't crash server if APIs are unavailable
getGo();
setInterval(() => {
	getGo();
}, 60000);

getVia();
setInterval(() => {
	getVia();
}, 60000);

getAmtrak();
setInterval(() => {
	getAmtrak();
}, 60000);
