var _ = require('lodash');
var Player = function(name){
	var hand = [];
	this.name = name;
	var points = 0;
	this.getHand = function(){
		return hand.map(function(card){return card.getInfo()});
	};
	this.take = function(card){
		hand.push(card);
	};
	this.throwACard = function(playedCard){
		var removedCard = _.remove(hand,function(card){
			var info = card.getInfo();
			return playedCard.suit == info.suit && playedCard.rank == info.rank;
		});
		return removedCard;
	};
	this.calculatePoints = function(point){
		points += point;
	};
	this.getPoints = function(){
		return points;
	};
};

module.exports = Player;


