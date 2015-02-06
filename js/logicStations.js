$(document).ready(function() {

// dynamically generate walking time dropdown select
	var htmlForWalkTime = "<select name='walkTime' id='chooseWalkTime'><option diabled>-Walking time to needed to your station?</option>";
	for (var i = 0; i < 91; i += 5) {
		htmlForWalkTime += "<option value=" + i + ">" + i + "</option>";
	}
	$('.walkTimeSelect').html( htmlForWalkTime );

	$('body').on('change', 'select#chooseStation', function() {
		// console.log("select changed");  works
//		$('.container2').show(); // reveal next dropdown
//		$('.container').unfocus(); // reveal next dropdown
		
	}); // end event listener for #chooseStation

}); // end doc ready

