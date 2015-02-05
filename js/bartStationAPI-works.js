$(document).ready(function() {
	var x2js = new X2JS(),
		recursionCount = 0;

	// var stations;

	var getStations = function (){

	$.ajax({
			url: "http://api.bart.gov/api/stn.aspx?cmd=stns&key=QYVK-J9QW-IUDQ-DT35",  // BART's key  MW9S-E7SL-26DU-VV8V
			type: "GET",
			dataType: "xml",
			success: function( xml ) {
						console.log( "success ", xml);
						var bart = x2js.xml2json(xml);

						if(bart.root.message === ""){
							$('#data').text(bart.root.stations.station[1].name);
						}else{
							console.log("We got the error");
							recursionCount++;
							if(recursionCount < 5){
								return getStations();
							} else {
								console.log("Too many API recursions!!");
								recursionCount = 0;
							}
						}

						


						// console.log( "success ", xml.root );
						// return xml;
						// stations = xml;
						// return stations;

						// console.log( toJSON( xml ) );
						// return toJSONasVAR( xml );
						// toJSONasVAR( xml );

					}, // end success
			fail: function() {
					    alert( "getStations failed\n" );
					}, // end fail
			error: function( xhr, status, errorThrown ) {
						alert( "There was a problem!" );
						console.log( "Error: " + errorThrown + "\n\n");
						console.log( "Status: " + status );
						console.dir( xhr );
					}, // end error
			always: function() {
					    alert( "getStations completed" );
					} // end always
			}

			// console.log( stations );

		); // end ajax
	}; //end getStations function




getStations();

}); // end doc ready

