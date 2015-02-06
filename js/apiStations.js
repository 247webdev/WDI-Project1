$(document).ready(function() {
	var x2js = new X2JS(),
		user = {
			"station":"STATION!",
			"route":"ROUTE!!",
			"leadTime":"LEADTIME!!!"
		},
		recursionCount = 0,
		apiKeyIndex = 0,
		apiKeys = ["QYVK-J9QW-IUDQ-DT35", "QSVS-UI6Y-ILTQ-DT35", "MW9S-E7SL-26DU-VV8V"], // QYVK... and QSVS... are mine, MW9S... is BART's
		currentKey = apiKeys[ apiKeyIndex ];

// initial function for ajax call to BART to get a list of stations
	var getStations = function (){
	$.ajax({
		url: "http://api.bart.gov/api/stn.aspx?cmd=stns",
		type: "GET",
		dataType: "xml",
		data: {
			key: currentKey
		},
		success: function( data ) {
// console.log( "success ", data);
			var bartData = x2js.xml2json( data );

			if(bartData.root.message === ""){
// API returned non-error
				console.log("moving forward... no error");

				var source = $('#staionList-template').html();
				var template = Handlebars.compile(source);
				var html = template({stationData: bartData});
				$('.container').html(html);

			}else{
// API returned error message
				console.log("We got the error");
				recursionCount++;
				if(recursionCount < 4) {
					return getStations();

// This current key is not working, try the next one
				} else if( apiKeyIndex < 2 ) {
					apiKeyIndex++;
					recursionCount =0;
					return getStations();

				} else {
// there were too many recursions... break recursion!!
					console.log("Too many API recursions!!");
					$('#errorMsg').text("BART's API is not cooperating. Please try again later.");
					recursionCount = 0;
				} // end else where recursionCount = 5
			} // end else where bartData.root.message not ""
		}, // end success handler

		fail: function() {
		    alert( "getStations failed\n" );
		}, // end fail handler

		error: function( xhr, status, errorThrown ) {
			alert( "There was a problem!" );
			console.log( "Error: " + errorThrown + "\n\n");
			console.log( "Status: " + status );
			console.dir( xhr );
		}, // end error handler

		always: function() {
		    alert( "getStations completed" );
		} // end always handler

		} // end ???

	); // end ajax
	}; //end getStations function


// function for ajax call to BART to get a list of train routes for a given station
	var getRoutes = function ( stationSelected ){
	$.ajax({
		url: "http://api.bart.gov/api/etd.aspx?cmd=etd",
		type: "GET",
		dataType: "xml",
		data: {
			key: currentKey,
			orig: stationSelected
		},
		success: function( data ) {
// console.log( "success ", data);
			var bartData = x2js.xml2json( data );

			if(bartData.root.message === ""){
// API returned non-error
				// console.log("moving forward... no error");
console.log( bartData );
				var source = $('#trainLine-template').html();
				var template = Handlebars.compile(source);
				var html = template({stationData: bartData});
				$('.container2').html(html);

			}else{
// API returned error message
				console.log("We got the API key error");
				recursionCount++;
				if(recursionCount < 4) {
					return getRoutes();

// This current key is not working, try the next one
				} else if( apiKeyIndex < 2 ) {
					apiKeyIndex++;
					recursionCount =0;
					return getRoutes();

				} else {
// there were too many recursions... break recursion!!
					console.log("Too many API recursions!!");
					$('#errorMsg').text("BART's API is not cooperating. Please try again later.");
					recursionCount = 0;
				} // end else where recursionCount = 5
			} // end else where bartData.root.message not ""
		}, // end success handler

		fail: function() {
		    alert( "getRoutes failed\n" );
		}, // end fail handler

		error: function( xhr, status, errorThrown ) {
			alert( "There was a problem!" );
			console.log( "Error: " + errorThrown + "\n\n");
			console.log( "Status: " + status );
			console.dir( xhr );
		}, // end error handler

		always: function() {
		    alert( "getRoutes completed" );
		} // end always handler

		} // end ???

	); // end ajax
	}; //end getRoutes function



getStations();


// listener for the user's choice of a station
$('body').on('change', '#chooseStation', function( e ){
	user.station = $("#chooseStation").val();

	console.log("\nStation Value: " + user.station );

	getRoutes( user.station );
});

// listener for the user's choice of a train line
$('body').on('change', '#chooseRoute', function( e ){
	user.route = $("#chooseRoute").val();

	console.log("\nRoute Value: " + user.route );
});

// listener for the user's choice of a lead walking time
$('body').on('change', '#chooseWalkTime', function( e ){
	user.leadTime = $("#chooseWalkTime").val();

	console.log("\nLead Time Value: " + user.leadTime );
});

// listener for the button which calls the getTime() funct
$('#getCountdownTime').on('click', function( e ){
	console.log( user );
	// getTime( user );
});

// console.log("\nstation: " + user.station +
// 			"\nroute: " + user.route +
// 			"\nleadTime: " + user.leadTime );
//	user.station
//	user.route
//	user.leadTime

}); // end doc ready

