var interval;
var updateListOfPlayers = function(players){
	var listHTML = players.map(function(name){return ['<li>',name,'</li>'].join(' ')}).join('\r\n');
	$('.players').html(listHTML);
}
var updateGameSetup = function(){
	$.getJSON('gameSetupStatus',function(data){
		if(data.ready) window.location.href = 'game.html';
		else updateListOfPlayers(data.players);
	});
};
var onPageReady = function(){
	interval = setInterval(updateGameSetup,5000);
};
$(document).ready(onPageReady);