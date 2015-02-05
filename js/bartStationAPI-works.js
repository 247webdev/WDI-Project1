$(document).ready(function() {
	var x2js = new X2JS(),
		recursionCount = 0;

	var getStations = function (){
	$.ajax({
		url: "http://api.bart.gov/api/stn.aspx?cmd=stns&key=QYVK-J9QW-IUDQ-DT35",  // BART's key  MW9S-E7SL-26DU-VV8V
		type: "GET",
		dataType: "xml",
		success: function( data ) {
			console.log( "success ", data);
			var bartData = x2js.xml2json( data );

			if(bartData.root.message === ""){
// API returned non-error
				console.log("moving forward... no error");

				// $('#data').text(bartData.root.stations.station[1].name);

				var source = $('#staionList-template').html();
				var template = Handlebars.compile(source);
				var html = template({stationData: bartData});
				$('.container').html(html);

			}else{
// API returned error message
				console.log("We got the error");
				recursionCount++;
				if(recursionCount < 5){
					return getStations();

				} else {
// there were too many recursions... break recursion!!
					console.log("Too many API recursions!!");
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

getStations();

}); // end doc ready

