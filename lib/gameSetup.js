var _ = require('lodash');
var GameSetup = function(){
	var players = [];
	this.isReady = function(){
		return players.length == 4;
	};
	this.join = function(player){
		if(players.length==4)
			throw new Error('4 Players have already joined');
		players.push(player);
	};
	this.leave = function(player){
		_.pull(players,player);
	};
	this.listPlayers = function(){
		return _.clone(players);
	};
	this.exists = function(player){
		return _.contains(players,player);
	};
};

module.exports = GameSetup;