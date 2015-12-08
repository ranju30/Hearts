var suit = {spade:'♠', heart:'♥', diamond:'♦', club:'♣'};
var handSrc = '{{#each hand}}<td>{{this}}</td>{{/each}}';

var handTemplate = Handlebars.compile(handSrc);
var updateBoard = function(data){
	console.log(data);
	var getRelativePlayer = function(step){
		return data.players[(data.location+step)%4];
	};
	$('.status').html(data.instruction);
	$('.playerSelf .name').html(getRelativePlayer(0));
	$('.playerSelf .hand').html(handTemplate(data));
	$('.leftPlayer .name').html(getRelativePlayer(1));
	$('.oppositePlayer .name').html(getRelativePlayer(2));
	$('.rightPlayer .name').html(getRelativePlayer(3));
};
var checkGameStatus = function(){
	$.getJSON('gameStatus',updateBoard)
};
var onPageReady = function(){
	setInterval(checkGameStatus,5000);
};

$(document).ready(onPageReady);