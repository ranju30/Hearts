var _ = require('lodash');
var Player = require('./player');
var Game = require('./game');
var Pack = require('./pack');

var Games = function(){
	var _games = [];
	var self = this;
	this.clear = function(){
		_games = [];
	};
	this.count = function(){
		return _games.length;
	};
	this.findByPlayer = function(name){
		return _.find(_games,function(g){return g.exists(name)})
	};
	this.ensureJoin = function(name){
		if(self.findByPlayer(name)) return;
		var player = new Player(name);
		var game = _.last(_games);
		if(!game || game.getNumberOfPlayers()==4) 
			_games.push(game = new Game());
		game.join(player);
	};
	this.killGame = function(id){
		if(self.count() == 1){
			self.clear();
		}
		else{
			_.remove(_games,function(game){
				return game.name == id;
			});
		}
	};
};

module.exports = Games;