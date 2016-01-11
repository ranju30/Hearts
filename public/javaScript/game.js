var symbols = {spade:'♠', heart:'♥', diamond:'♦', club:'♣'};
var playerTemplate = Handlebars.compile('<div class="name">{{name}}</div><div class="points">{{points}}</div>');
var cardTemplate = Handlebars.compile('<td><div class="card {{suit}}" id="{{suit}} {{rank}}""><div>{{rank}}</div><div>{{symbol}}</div></div></td>');
var boardTemplate = Handlebars.compile('<td height="20px" width="3px"><div class="{{suit}}" id="{{suit}} {{rank}}""><div>{{rank}}</div><div>{{symbol}}</div></div></td>');
var toCardHTML = function(card){
	card.symbol = symbols[card.suit];
	return cardTemplate(card);
};

var generateHand = function(hand){
	return hand.map(toCardHTML).join('\r\n');
};

var showPlayedCardToHTML = function(card){
	card.symbol = symbols[card.suit];
	return boardTemplate(card);
};

var convertToValueObject = function(cardID){
	var cardValue = cardID.split(" ");
	return {suit:cardValue[0],rank:cardValue[1]};
};

var toggleSelection = function(){
	$(this).toggleClass('select');
	if($('.select').length==1){
		$('.action').show();
		var selectedCard = convertToValueObject($('.select')[0].id);
		$.post('startGame',selectedCard);
	}
	else
		$('.action').hide();
};
var bindEvents = function(){
	$('.card').click(toggleSelection);
};
var updateBoard = function(data){
	var getRelativePlayer = function(step){
		return playerTemplate(data.players[(data.location+step)%4]);
	};
	$('.status').html(data.instruction);
	$('.playerSelf .name').html(getRelativePlayer(0));

	$('.leftPlayer').html(getRelativePlayer(1));

	$('.oppositePlayer .name').html(getRelativePlayer(2));

	$('.rightPlayer .name').html(getRelativePlayer(3));

	$('.playerSelf .hand').html(generateHand(data.hand));
	bindEvents();
};
var getBoardStatus = function(data){
	var cards = JSON.parse(data);
	if(cards.length==0){
		for(var i = 0;i<4;i++){
			$('.card'+i).empty();
		};
	}
	else
		cards.forEach(function(card,index){
			$('.playedCards .card'+index).html(showPlayedCardToHTML(card));
		});
};
var updateRound = function(){
	$.get('boardStatus',getBoardStatus);
};
var checkGameStatus = function(){
	$.getJSON('gameStatus',updateBoard)
};
var onPageReady = function(){
	setInterval(checkGameStatus,500);
	$('.action').hide();
	setInterval(updateRound,500);
};

$(document).ready(onPageReady);