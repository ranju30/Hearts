var suit = {spade:'♠', heart:'♥', diamond:'♦', club:'♣'};
var handSrc = '{{#each hand}}<td><div class="card {{suit}} rank{{rank}}"><div class="rank"></div><div class="suit"></div></div></td>{{/each}}';
var playerSrc = '<div class="name">{{name}}</div><div class="points">{{points}}</div>';
var handTemplate = Handlebars.compile(handSrc);
var playerTemplate = Handlebars.compile(playerSrc);
var updateBoard = function(data){
	console.log(data);
	var getRelativePlayer = function(step){
		return playerTemplate(data.players[(data.location+step)%4]);
	};
	$('.status').html(data.instruction);
	$('.playerSelf .name').html(getRelativePlayer(0));
	$('.leftPlayer .name').html(getRelativePlayer(1));
	$('.oppositePlayer .name').html(getRelativePlayer(2));
	$('.rightPlayer .name').html(getRelativePlayer(3));
	$('.playerSelf .hand').html(handTemplate(data));
};
var checkGameStatus = function(){
	$.getJSON('gameStatus',updateBoard)
};
var onPageReady = function(){
	setInterval(checkGameStatus,5000);
};

$(document).ready(onPageReady);