var updateList = function(data){
	console.log(data);
};
var findGames = function(){
	$.getJSON('gameList',updateList);
};
var onPageReady = function(){
	setTimeout(findGames,5000);
};

$(document).ready(onPageReady);