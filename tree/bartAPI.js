$(document).ready(function () {
	$("form").on("submit", function (event) {
	    event.preventDefault();
	    var station = this.station.value;

// get XML from BARTs API
		var bartData = function(station) {
			$.ajax({
				url: "http://api.bart.gov/api/etd.aspx?cmd=etd",
				type: "GET",
				dataType : "xml",
				data: {
					orig: station,
					key: 'MW9S-E7SL-26DU-VV8V'
				},
				success: function( xml ) {
					console.log("api done."+xml);

// NEED TO PARSE THE XML HERE   http://stackoverflow.com/questions/1773550/convert-xml-to-json-and-back-using-javascript
					var x2js = new X2JS();
					function convertXml2JSon() {
					    var result = JSON.stringify(x2js.xml_str2json( xml ));
					    return result;
					}
//				$( "<h1>" ).text( xml.title ).appendTo( "body" );
//				$( "<div class=\"content\">").html( json.html ).appendTo( "body" );
		},
		error: function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
		},
		complete: function( xhr, status ) {
			alert( "The request is complete!" );
				}
			});
		};
	});
});

//bartData("MONT");


var sampleBartDataAsJSON = {
	"root":{
		"uri":{
			"__cdata":" http://api.bart.gov/api/sched.aspx?cmd=special&l=1 "
		},
		"special_schedules":{
			"special_schedule":[{
				"start_date":"12/05/2014",
				"end_date":"03/01/2015",
				"start_time":"20:00",
				"end_time":"04:00",
				"text":"Expect minor delays between Coliseum and San Leandro stations Fri., Sat., Sun. nights through February.",
				"link":{
					"__cdata":"\nhttp://www.bart.gov/news/articles/2014/news20141205\n"
				},
				"orig":"DUBL",
				"dest":"DALY",
				"day_of_week":"0, 5, 6",
				"routes_affected":"ROUTE 11, ROUTE 12"
			},
			{
				"start_date":"12/09/2014",
				"end_date":"12/31/2015",
				"start_time":"23:00",
				"end_time":"04:00",
				"text":{
					"a":{
						"_href":"http://www.actransit.org/allnighter/",
						"__text":"late night bus service"
					},
					"__text":"AC Transit is running enhanced\n\n\nbetween San Francisco and the East Bay."
				},
				"link":{
					"__cdata":"\nhttp://www.bart.gov/news/articles/2014/news20141209\n"
				},
				"orig":"",
				"dest":"",
				"day_of_week":"",
				"routes_affected":"ROUTE 1, ROUTE 2, ROUTE 3, ROUTE 4, ROUTE 5, ROUTE 6, ROUTE 7, ROUTE 8, ROUTE 11, ROUTE 12, ROUTE 19, ROUTE 20"
			}]
		},
		"message":{
			"legend":"day_of_week: 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday, blank = all days"
		}
	}
};
// sampleBartDataAsJSON.root.special_schedules.special_schedule[1].end_time gives the result "04:00"

//==================================================================================
// MONT	Montgomery St.  <======
// DELN	El Cerrito del Norte  <======

// station list  http://api.bart.gov/api/stn.aspx?cmd=stns 
// 12TH	12th St. Oakland City Center
// 16TH	16th St. Mission
// 19TH	19th St. Oakland
// 24TH	24th St. Mission
// ASHB	Ashby
// BALB	Balboa Park
// BAYF	Bay Fair
// CAST	Castro Valley
// CIVC	Civic Center/UN Plaza
// COLS	Coliseum/Oakland Airport
// COLM	Colma
// CONC	Concord
// DALY	Daly City
// DBRK	Downtown Berkeley
// DUBL	Dublin/Pleasanton
// DELN	El Cerrito del Norte  <======
// PLZA	El Cerrito Plaza
// EMBR	Embarcadero
// FRMT	Fremont
// FTVL	Fruitvale
// GLEN	Glen Park
// HAYW	Hayward
// LAFY	Lafayette
// LAKE	Lake Merritt
// MCAR	MacArthur
// MLBR	Millbrae
// MONT	Montgomery St.  <======
// NBRK	North Berkeley
// NCON	North Concord/Martinez
// OAKL	Oakland Int'l Airport
// ORIN	Orinda
// PITT	Pittsburg/Bay Point
// PHIL	Pleasant Hill/Contra Costa Centre
// POWL	Powell St.
// RICH	Richmond
// ROCK	Rockridge
// SBRN	San Bruno
// SFIA	San Francisco Int'l Airport
// SANL	San Leandro
// SHAY	South Hayward
// SSAN	South San Francisco
// UCTY	Union City
// WCRK	Walnut Creek
// WDUB	West Dublin/Pleasanton
// WOAK	West Oakland