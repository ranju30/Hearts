var _ = require('lodash');
var Game = function(pack){
	var self = this;
	var players = [];
	var playerTurn;
	this.playedCards = [];


	this.name = new Date().getTime();
	this.getNumberOfPlayers = function(){
		return players.length;
	}
	this.join = function(player){
		if(players.length==4) throw new Error('no spots available');
		players.push(player);
		if(players.length==4) deal();	
	};
	var hasTwoOfClub = function(){
		var starterPlayer = players.filter(function(player){
			return _.find(player.getHand(),{suit:'club',rank:'2'});
		});
			return starterPlayer[0].name;
	};
	var deal = function(){
		pack.shuffle();
		var distribute = function(index){
			players[index%4].take(pack.drawOne());
		};
		_.times(52,distribute);
		playerTurn = hasTwoOfClub();
	};
	this.getStatus = function(player){
		var result = {
			players: players.map(function(p){return {name:p.name,points:0}}),
			location:_.pluck(players,'name').indexOf(player),
			hand: _.find(players,{name:player}).getHand(),
			playedCard: this.playedCards,
		};
		if(players.length<4)
			result.instruction = 'Waiting for ' + (4-players.length) + ' players';			
		else{
			result.instruction = playerTurn + "'s turn";
		}
		return result;
	};
	this.exists = function(player){
		return _.any(players,{name:player});
	};
	Object.defineProperty(this,'summary',{get:function(){
		return {name:self.name,players:_.pluck(players,'name')}
	}});
	this.nextPlayer = function(currentPlayer){
		var currentPlayerIndex = _.findIndex(players,{'name':currentPlayer});
		playerTurn = players[(currentPlayerIndex+1)%4].name;
		return playerTurn;
	};
	this.isValidCard = function(card){
		return card.suit == this.playedCards[0].suit;
	};
	this.isTurn = function(player,card){
		if(player == playerTurn && card.suit == 'club' && card.rank == '2')
			return playerTurn == player && this.nextPlayer(player);
	 	else if(this.playedCards.length != 0 && this.isValidCard(card)){
			return playerTurn == player && this.nextPlayer(player);
	 	}
		return false;
	};
	this.updateHand = function(player,card){
		this.playedCards.push(card);
		_.find(players,{name:player}).throwACard(card);
	};
};



module.exports = Game;