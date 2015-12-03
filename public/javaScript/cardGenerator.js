var lib = {};

lib.Card = function(suit,name,rank){
	this.suit = suit;
	this.name = name;
	this.rank = rank;
};

lib.generateDeckOf52Cards = function(){
	var prioritisedCards = [2,3,4,5,6,7,8,9,10,'Jack','Queen','King','Ace'];
	var suits = ['Heart','Spade','Club','Diamond'];
	var deckOfCards = [];
	suits.forEach(function(eachSuit){
		prioritisedCards.forEach(function(eachCard,indexOfprioritisedCards){
			deckOfCards.push(new lib.Card(eachSuit,eachCard,indexOfprioritisedCards + 1));
		});
	});
	return deckOfCards;
};

exports.lib = lib;
