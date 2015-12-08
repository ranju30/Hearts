var _ = require('lodash');
var Game = function(players){
	var players = _.cloneDeep(players);
	this.deal = function(pack){
		pack.shuffle();
		var distribute = function(index){
			players[index%4].take(pack.drawOne());
		};
		_.times(52,distribute);
	};
	this.getStatus = function(player){
		var result = {
			instruction:'Please select 3 cards to pass',
			players: _.pluck(players,'name'),
			location:_.pluck(players,'name').indexOf(player),
			hand: _.find(players,{name:player}).getHand()
		};
		return result;
	};
	this.exists = function(player){
		return _.any(players,{name:player});
	}
};

module.exports = Game;