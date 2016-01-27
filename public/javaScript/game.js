var symbols = {spade:'♠', heart:'♥', diamond:'♦', club:'♣'};
var playerTemplate = Handlebars.compile('<div class="name">{{name}} ({{points}})</div>');
var cardTemplate = Handlebars.compile('<td><div class="card {{suit}}" id="{{suit}} {{rank}}"><div>{{rank}}</div><div>{{symbol}}</div></div></td>');
var boardTemplate = Handlebars.compile('<td><div class="{{suit}}" id="{{suit}} {{rank}}""><div>{{rank}}</div><div>{{symbol}}</div></div></td>');
var totalPointTemplate = Handlebars.compile('{{name}} : {{total}}')
var gameStatusTime;

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
var passCards = function(){
	if($('.select').length == 3){
		$('.action').hide();
		var selectedCards = [];
		var firstCard = convertToValueObject($('.select')[0].id);
		selectedCards.push(firstCard);
		var secondCard = convertToValueObject($('.select')[1].id);
		selectedCards.push(secondCard);
		var thirdCard = convertToValueObject($('.select')[2].id);
		selectedCards.push(thirdCard);
		$.post('selectCardToPass','cards='+JSON.stringify(selectedCards));
		gameStatusTime = timer(); 
	}
};

var toggleSelection = function(){
	$(this).toggleClass('select');
	if($('.select').length==1){
		var selectedCard = convertToValueObject($('.select')[0].id);
		$.post('startGame',selectedCard);
	};
};
var bindEvents = function(){
	$('.card').click(toggleSelection);
};

var updateBoard = function(data){
	var getRelativePlayer = function(step){
		return playerTemplate(data.players[(data.location+step)%4]);
	};
	var getTotalPoints = function(step){
		return totalPointTemplate(data.players[(data.location+step)%4]);
	}
	$('.status').html(data.instruction);
	if(data.players.length == 4){
		$('.totalPoint .name1').html(getTotalPoints(0));
		$('.totalPoint .name2').html(getTotalPoints(1));
		$('.totalPoint .name3').html(getTotalPoints(2));
		$('.totalPoint .name4').html(getTotalPoints(3));
	}
	
	$('.playerSelf .name').html(getRelativePlayer(0));
	$('.leftPlayer .name').html(getRelativePlayer(1));
	$('.oppositePlayer .name').html(getRelativePlayer(2));
	$('.rightPlayer .name').html(getRelativePlayer(3));

	$('.playerSelf .hand').html(generateHand(data.hand));
	
	bindEvents();
};
var finishGame = function(data){
	console.log(data.winner)
	if(data.winner){
		$('.status').html(data.winner);
		clearInterval(gameStatusTime);
	}
};
var checkGameStatus = function(){
	$.getJSON('gameStatus',updateBoard)
};
var checkGameOver = function(){
	$.getJSON('gameOver',finishGame);
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
	checkGameOver();
};

var timer = function(){
	setInterval(function(){
		checkGameStatus();
		updateRound();
	},1500);
};

var onPageReady = function(){
	// $.getJSON('gameStatus',function(data){
	// 	if(data.passed){
	// 		$('#pass').hide();
	// 		timer();
	// 	}
	// });
	// checkGameStatus();
	// $('#pass').click(passCards);
	timer();
	$('.action').hide();	
};

$(document).ready(onPageReady);
