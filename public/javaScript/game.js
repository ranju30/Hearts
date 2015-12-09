var symbols = {spade:'♠', heart:'♥', diamond:'♦', club:'♣'};
var playerTemplate = Handlebars.compile('<div class="name">{{name}}</div><div class="points">{{points}}</div>');
var cardTemplate = Handlebars.compile('<td><div class="card {{suit}}"><div>{{rank}}</div><div>{{symbol}}</div></div></td>');
var toCardHTML = function(card){
	card.symbol = symbols[card.suit];
	return cardTemplate(card);
};
var generateHand = function(hand){
	return hand.map(toCardHTML).join('\r\n');
};
var toggleSelection = function(){
	$(this).toggleClass('select');
};
var bindEvents = function(){
	$('.card').click(toggleSelection);
};
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
	$('.playerSelf .hand').html(generateHand(data.hand));
	bindEvents();
};
var checkGameStatus = function(){
	$.getJSON('gameStatus',updateBoard)
};
var onPageReady = function(){
	setTimeout(checkGameStatus,5000);
};

$(document).ready(onPageReady);