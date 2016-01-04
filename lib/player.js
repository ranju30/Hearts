var _ = require('lodash');
var Player = function(name){
	this.hand = [];
	this.name = name;
	this.getHand = function(){
		return this.hand.map(function(card){return card.getInfo()});
	};
	this.take = function(card){
		this.hand.push(card);
	};
	this.throwACard = function(playedCard){
		return _.remove(this.hand,function(card){
			return playedCard.suit == card.suit && playedCard.rank == card.rank;
		});
	};
};

module.exports = Player;