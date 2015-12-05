var _ = require('lodash');
var Game = function(players){
	var players = _.cloneDeep(players);
	this.deal = function(cards,shuffle){
		if(!shuffle) shuffle = _.shuffle; 
		var shuffledCards = shuffle(cards);
		var distribute = function(card,index){
			players[index%4].take(card);
		};
		shuffledCards.forEach(distribute);
	};
	this.getStatus = function(player){
		var result = {
			instruction:'Please select 3 cards to pass',
			players: _.pluck(players,'name'),
			location:_.pluck(players,'name').indexOf(player),
			cards: _.find(players,{name:player}).getCards()
		};
		return result;
	};
	this.exists = function(player){
		return _.any(players,{name:player});
	}
};

module.exports = Game;