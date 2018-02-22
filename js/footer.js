$(document).ready(function(){

	var str = "<div class='container'>\n";
			str +="	<div class='row'>\n";
			str +="		<span class='hidden-xs'>\n";
			str +="			<div class='col-sm-6'>\n";
			str +="				<span><i class='glyphicon glyphicon-envelope'></i><a href='mailto:me@christianchandler.net'>Christian B. Chandler</a></span><span class='hidden-sm hidden-xs social-seperator'>|</span>\n";
			str +="				<span><i class='glyphicon glyphicon-social-twitter'></i><a href='http://twitter.com/DroidAppy' target='_new'>Twitter</a></span><span class='hidden-sm hidden-xs social-seperator'>|</span>\n";
			str +="				<span><a href='http://www.linkedin.com/in/christianchandler/' target='_new'>Linkedin</a></span>\n";
			str +="			</div>\n";
			str +="		</span>\n"; // END hidden-xs
			str +="		<span class='visible-xs'>\n";
			str +="				<div class='col-sm-12 col-xs-offset-0'>\n";
			str +="					<span><i class='glyphicon glyphicon-envelope'></i><a href='mailto:me@christianchandler.net'>Christian B. Chandler</a></span>\n";
		// str +="					<span><a href='http://247webdev.blogspot.com/' target='_new'>Blog</a></span>\n";
			str +="					<span><a href='http://twitter.com/DroidAppy' target='_new'>Twitter</a></span>\n";
			str +="					<span><a href='http://www.linkedin.com/in/christianchandler/' target='_new'>Linkedin</a></span>\n";
			str +="				</div>\n";
			str +="		</span>\n"; // END visible-xs
			str +="	</div>\n";
			str +="</div>";

	$(".footer").html(str); 

});