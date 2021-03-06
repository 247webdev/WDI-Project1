$(document).ready(function(){

	var x2js = new X2JS(),
		user = {
			// Initialize the key : value pairs "station":"" sets the key station to an empty string
			"station":"",				// the station chosen by the user. user.station is passed to the API as the origin station.
			"route":"",					// this is the name of the direction of the train at the given station
			"routeIndex":"",			// the index of the above route 
			"leadTime":"1",				// the default lead time until leaving for the train
			"trainObj":"",				// ********* NOT needed ???? I can't find this key name in this file ****************
			"timeArray":[],				// array of the possible train times (usually 3 trains). This array will likely contain sub-arrays, each represending the next train by storing the ETA and the index
			"selectedTrainIndex":"0",	// the default index of the above timeArray. Each time in this array is an acceptable train ETA considering the user's own lead time. Advance this variable if the user wants the next train.
			"userLeaveingIn":0,			// time the app displays of how much time the user has until leaving for train
			"timeMessage":""			// the summary message based on the time < 2 min is "Get ready to go in a minute", < 1 min is "Less than one minute left." and < 10 seconds is "Time to leave now!"
			},
		timeInterval,
		apiCaptureTime,
		bartData;

	// var buttonStart = $('').;
	$("#getCountdownTime").click(function(){
	    $("#getCountdownTime").hide();
	    $("#stopCountdownTime").show();
	});

	$("#getNextTrain").click(function(){
		// Maybe develop this function later once all the MVP functionallity is tip-top.
		// I think this was when the user wanted to pass on their orignal train choice and select the next one
		//   Therefore, change the selected train variable to the next one.
		//     -> since the API usually returns 3 trains, check if the user's train is the last in the array. If so redo the API call?
		//     -> If not, select the next train in the array. Any other gotchas??
	});

	$("#stopCountdownTime").click(function(){
	    $("#stopCountdownTime").hide();
	    $("#getCountdownTime").show();
	});


	// initial function for ajax call to BART to get a list of stations
	var getStations = function(){
		dataReturned = false;
		$.ajax({
			url: "http://api.bart.gov/api/stn.aspx?cmd=stns",
			type: "GET",
			dataType: "xml",
			data: {
				key: "QYVK-J9QW-IUDQ-DT35"  // I had used currentKey when I was trying multiple API keys. Now I just need one.
				},

			success: function( data ) {
				// console.log( "success ", data);
				var bartData = x2js.xml2json( data );
				if(bartData.root.message === ""){
					// API returned no error. ********** Confirm with the documentation that no message means no error.
					console.log("moving forward... no error");
					dataReturned = true;
					var source = $('#staionList-template').html();
					var template = Handlebars.compile(source);
					var html = template({stationData: bartData});
					$('.containerStations').html(html);
				}else{
					// API returned error message
					console.log("We got some API error");
					recursionCount++;
					if(recursionCount < 4) {
						return getStations();
					}else{
						// there were too many recursions... break recursion!!
						console.log("5 API attempts.");
						$('#errorMsg').text("BART's API is not responding even after 5 attempts. Please try again later.");
					} // end else where recursionCount = 5
				} // end else where bartData.root.message not ""
			}, // end success handler

			fail: function(){
				alert( "getStations failed\n" );
				apiCaptureTime = null;
			}, // end fail handler

			error: function( xhr, status, errorThrown ) {
				alert( "There was a problem!" );
				console.log( "Error: " + errorThrown + "\n\n");
				console.log( "Status: " + status );
				console.dir( xhr );
			}, // end error handler

			always: function(){
				alert( "getStations function completed. This line does not imply success or failure." );
				// any house cleaning needed here?
			} // end always handler

		}); // end ajax
	}; //end getStations function


	// function for ajax call to BART to get a list of train routes for a given station
	var getRoutes = function(){
		$.ajax({
			url: "http://api.bart.gov/api/etd.aspx?cmd=etd",
			type: "GET",
			dataType: "xml",
			data: {
				key: "QYVK-J9QW-IUDQ-DT35", //currentKey,
				orig: user.station
				},

			success: function( data ) {
				console.log( "success ", data);
				bartData = x2js.xml2json( data );

				if(bartData.root.message === ""){
					// API returned non-error
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

		}); // end ajax
	}; //end getRoutes function

	var getTime = function(){
		user.timeArray = []; // zero out train time array

		var formatTime = function(min, sec) {
		    var s = "0" + sec.toString();
		    s = s.substr(s.length-2);
		    console.log("seconds: " + s);
		    var time = "Time remaining: " + min.toString() + ":" + s;
		    return time;
		};
 
		var startTime = new Date();

		// console.log("bartData: " + bartData + "user.routeIndex: " + user.routeIndex );
		// console.log("Get train time: " + bartData.root.station.etd[ user.routeIndex ].estimate[0].minutes );
		// console.log("Num of trains coming soon: " + bartData.root.station.etd[ user.routeIndex ].estimate.length );
		// root.station.etd[i].abbreviation
		//	 				  .destination
		//	 				  .estimate[i]
		// 						  .minutes

		var stationObj = bartData.root.station.etd[ user.routeIndex ];

		for (var i = 0, trainFoundIndex = 0; i < stationObj.estimate.length; i++) {
			var trainETA = ( parseInt( stationObj.estimate[i].minutes) * 60000) - 60000;  // this is the API's ETA for train minus 1 minute as my hack to ensure a little extra time for the user to walk to the correct platform.
			if ( trainETA >= user.leadTime ) {
				user.userLeaveingIn = trainETA - (user.leadTime * 60000); // intermediate calculation for the i-th train's ETA within this for loop 
				user.timeArray[trainFoundIndex] = user.userLeaveingIn; // array of the available user leave times based on train at statinoObj.estimate[index]
				trainFoundIndex++;

				console.log("Train #" + trainFoundIndex + " departing in: " + user.userLeaveingIn); // here, is how much time the user has left until they need to leave for their train
				// console.log( "Train lead time: " + stationObj.estimate[i].minutes );
				// console.log( "User lead time: " + user.leadTime );
				// console.log( "Index: " + i + " has " + user.userLeaveingIn.toString() + " time.");
				// console.log( "Train Index " + (trainFoundIndex-1) + "\n" + "Your #" + trainFoundIndex + " train leaves your selected station in " + user.userLeaveingIn.toString() + " minute." ); // this shows the array index of the train and the lead time for said train

			} // end of if trainETA >= user.leadTime
		} // end for loop on stationObj.estimate

		timeInterval = setInterval( function(){ timer(); }, 1000 );

		function timer() {
			var tickingTime = new Date();
			// tickingTime = tickingTime.toLocaleTimeString();
			var timeDifference = tickingTime - startTime;

			console.log("user.userLeaveingIn " + (( user.timeArray[user.selectedTrainIndex] - timeDifference )/ 1000)/ 60 + "\n");

			var minutesRemaining = Math.floor(((user.timeArray[user.selectedTrainIndex] - timeDifference)/ 1000 )/60);
			var secondsRemaining = Math.round(60 * ((((user.timeArray[user.selectedTrainIndex] - timeDifference)/ 1000 )/60 ) % 1 ));

			// user.timeMessage
			// < 2 min is "Get ready to go in a minute"
			// < 1 min is "Less than one minute left" and
			// if also < 1 second is "Time to leave now!"
			// < 10 seconds is "Time to leave now!"

			if (minutesRemaining < 1) {
				if(secondsRemaining < 1){
					user.timeMessage = "Time to leave now!"; // time to leave now
				}else{
					user.timeMessage = "Less than one minute left"; // get ready to leave in less than a minute
				}
			}else if (minutesRemaining < 2){
				user.timeMessage = "Get ready to go in a minute";
			}else if (minutesRemaining > 5){
				user.timeMessage = ""; // more than 5 min to go
			}

			displayTimeDifference = formatTime(minutesRemaining, secondsRemaining); // used to format the time with seconds having one leading zero


			// user.selectedTrainIndex advance this index if the user wants the next train in the user.timeArray[user.selectedTrainIndex]
			// if user.selectedTrainIndex advances, check the length of the user.timeArray. Maybe the user wants to advance the train outside of the index.

			// STILL NEED TO SHOW THE REMAINING TIME
			// the function below subtracts 180 seconds from the date passed. take out the minus and it can add seconds
			//function dateAdd(date, units) {
			//   date.setTime(date.getTime() + units*1000);
			//   return date;
			// }

			// d = new Date();
			// document.getElementById('output').innerHTML = dateAdd(d, -180);



			document.getElementById("currentTime").innerHTML = displayTimeDifference;
			// user.timeArray  array of the available trains

		} // END timer function

	}; // END getTime function




// listener for the user's choice of a station
$('body').on('change', '#chooseStation', function( e ){
	user.station = $("#chooseStation").val();
	// user.stationIndex = $("#chooseStation")[0].selectedIndex -1;   // this index is not needed
	// console.log( $("#chooseStation")[0].selectedIndex -1 ); // match this value against the Inspect Element in Concole data-index
	// console.log( "\nstation index: " + user.stationIndex );
	// console.log( "\nStation Value: " + user.station );

	getRoutes();
});

// listener for the user's choice of a train line
$('body').on('change', '#chooseRoute', function( e ){
	user.route = $("#chooseRoute").val();
	user.routeIndex = $("#chooseRoute")[0].selectedIndex -1;

	// console.log("\nRoute Index: " + user.routeIndex);
	// console.log("\nRoute Value: " + user.route );
});

// listener for the user's choice of a lead walking time
$('body').on('change', '#chooseWalkTime', function( e ){
	user.leadTime = $("#chooseWalkTime").val();

	// console.log("\nLead Time Value: " + user.leadTime );
});

// listener for the button which calls the getTime() funct
$('#getCountdownTime').on('click', function( e ){
	// console.log( user );
	var minutesRemaining = 0;
	var secondsRemaining = 0;
	getTime();
});

// listener for the stop timer button
$('#stopCountdownTime').on('click', function( e ){
	clearInterval(timeInterval);
	document.getElementById("currentTime").innerHTML = displayTimeDifference;
});

// console.log("\nstation: " + user.station +
// 			"\nroute: " + user.route +
// 			"\nleadTime: " + user.leadTime );
//	user.station
//	user.route
//	user.leadTime

	var initialize = function(){
		var dataReturned;
		$("#getCountdownTime").hide();
		$("#stopCountdownTime").hide();
		$("#errorMsg").hide();
		$("steps").show();
		$("step1").show();
		$("step2").hide();
		$("step3").hide();
		$("step4").hide();
		$("currentTime").hide();
		
		getStations();
		if(dataReturned === "" || dataReturned === null || dataReturned === false){
			//no meaningful data returned from the API. Activate the errorMsg
			// the errorMsg already inserted. Just .show the errorMsg div
			$("#errorMsg").show();
			$("steps").hide();
			$("fatalMsg").text("BART is not providing train information. The App cannot proceed. Please try again once BART's system is running again.");
			$("fatalMsg").show();
		}
	}; // END initialize function

	initialize();

}); // end doc ready






// handle this message "Updates are temporarily unavailable." appearing when there are no more trains for the day
// check if it is after midnight and alert no more trains
// check if the selected train is the last train of the day and alert there are no options after it
