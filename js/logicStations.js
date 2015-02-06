$(document).ready(function() {

// dynamically generate walking time dropdown select
	var htmlForWalkTime = "<select name='walkTime' id='chooseWalkTime' alt='Time needed to get to your station?'><option value='1'>1</option>"; // Time needed to get to your station?
	for (var i = 5; i < 31; i += 5) {
		htmlForWalkTime += "<option value=" + i + ">" + i + "</option>";
	}
	$('.walkTimeSelect').html( htmlForWalkTime );

// 	$('body').on('change', 'select#chooseStation', function() {
// 		// console.log("select changed");  works
// //		$('.container2').show(); // reveal next dropdown
// //		$('.container').unfocus(); // reveal next dropdown
		
// 	}); // end event listener for #chooseStation

}); // end doc ready

