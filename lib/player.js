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
		var removedCard = _.remove(this.hand,function(card){
			var info = card.getInfo();
			return playedCard.suit == info.suit && playedCard.rank == info.rank;
		});
		return removedCard;
	};
};

module.exports = Player;