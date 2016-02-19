var totalPointTemplate = Handlebars.compile('<td>{{player}}</td><td>{{points}}</td>');

var getTotalPoints = function(data){
	return totalPointTemplate(data);
};

var logOut = function(){
	window.location = "login.html";
};

var getWinneName = function(){
	$.get('endGame', function(data){
		document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		var d= JSON.parse(data)
		$('.result').html(d[0].player);
		$('.totalPoint .name1').html(getTotalPoints(d[0]));
		$('.totalPoint .name2').html(getTotalPoints(d[1]));
		$('.totalPoint .name3').html(getTotalPoints(d[2]));
		$('.totalPoint .name4').html(getTotalPoints(d[3]));
	});
};

$(document).ready(function(){
	if(document.cookie == ''){
		window.location = "login.html";
	};
	getWinneName();
	$('.image').click(logOut);
});