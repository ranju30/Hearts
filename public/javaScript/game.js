var symbols = {spade:'♠', heart:'♥', diamond:'♦', club:'♣'};
var playerTemplate = Handlebars.compile('<div class="name">{{name}}</div><div class="points">{{points}}</div>');
var cardTemplate = Handlebars.compile('<td><div class="card {{suit}}" id="{{suit}} {{rank}}""><div>{{rank}}</div><div>{{symbol}}</div></div></td>');
var boardTemplate = Handlebars.compile('<td height="20px" width="3px"><div class="{{suit}}" id="{{suit}} {{rank}}""><div>{{rank}}</div><div>{{symbol}}</div></div></td>');
var toCardHTML = function(card){
	card.symbol = symbols[card.suit];
	return cardTemplate(card);
};
var toBoardHtml = function(card){
	card.symbol = symbols[card.suit];
	return boardTemplate(card);
}

var generateHand = function(hand){
	return hand.map(toCardHTML).join('\r\n');
};

var showPlayedCard = function(cards){
	return toBoardHtml(cards[cards.length-1]);
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
		console.log(selectedCard);
		$.post('startGame',selectedCard);
	}
	else
		$('.action').hide();
};
var bindEvents = function(){
	$('.card').click(toggleSelection);
};
var updateBoard = function(data){
	console.log(data);
	var cardPosition = (data.playedCard.length-1) % 4;
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
	if(data.playedCard.length != 0){
		$('.playedCards .card'+cardPosition).html(showPlayedCard(data.playedCard));
	}
};
var checkGameStatus = function(){
	$.getJSON('gameStatus',updateBoard)
};
var onPageReady = function(){
	setInterval(checkGameStatus,5000);
	$('.action').hide();
};

$(document).ready(onPageReady);