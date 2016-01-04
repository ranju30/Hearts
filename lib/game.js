var _ = require('lodash');
var Game = function(pack){
	var self = this;
	var players = [];
	
	this.name = new Date().getTime();
	this.getNumberOfPlayers = function(){
		return players.length;
	}
	this.join = function(player){
		if(players.length==4) throw new Error('no spots available');
		players.push(player);
		if(players.length==4) deal();	
	};
	var deal = function(){
		pack.shuffle();
		var distribute = function(index){
			players[index%4].take(pack.drawOne());
		};
		_.times(52,distribute);
	};
	this.getStatus = function(player){
		var result = {
			players: players.map(function(p){return {name:p.name,points:0}}),
			location:_.pluck(players,'name').indexOf(player),
			hand: _.find(players,{name:player}).getHand()
		};
		if(players.length<4)
			result.instruction = 'Waiting for other players';			
		else{
			result.instruction = this.hasTwoOfClub() + "'s turn";
		}
		return result;
	};
	this.exists = function(player){
		return _.any(players,{name:player});
	};
	Object.defineProperty(this,'summary',{get:function(){
		return {name:self.name,players:_.pluck(players,'name')}
	}});
	this.hasTwoOfClub = function(){
		var starterPlayer = players.filter(function(player){
			return _.any(player.getHand(),{suit:'club',rank:'2'});
		});
		return starterPlayer[0].name;
	};
	this.trickStarter = function(){
		return this.hasTwoOfClub();
	};
	this.nextPlayer = function(currentPlayer){
		var currentPlayerIndex = _.findIndex(players,{'name':currentPlayer});
		return players[(currentPlayerIndex+1)%4].name;
	};
};



module.exports = Game;