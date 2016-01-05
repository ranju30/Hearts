var _ = require('lodash');
var Game = function(pack){
	var self = this;
	var players = [];
	var counter = 0;
	var playerTurn;

	// var currentPlayerTurn = (counter!=0) ? this.nextPlayer(currentPlayerTurn) : this.hasTwoOfClub();
		
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
		// if(starterPlayer.length != 0){
			return starterPlayer[0].name;
		// }
		// return false;
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
			hand: _.find(players,{name:player}).getHand()
		};
		if(players.length<4)
			result.instruction = 'Waiting for other players';			
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
	// this.trickStarter = function(player){
	// 	if(counter == 0) {
	// 		counter++;
	// 		return this.hasTwoOfClub();
	// 	}else{
	// 		console.log('-----------------');
	// 		return this.nextPlayer(player);
	// 	}
	// };
	this.nextPlayer = function(currentPlayer){
		var currentPlayerIndex = _.findIndex(players,{'name':currentPlayer});
		console.log(players[(currentPlayerIndex+1)%4].name)
		playerTurn = players[(currentPlayerIndex+1)%4].name;
		return playerTurn;
	};
	this.isTurn = function(player){
		return playerTurn == player && this.nextPlayer(player);
		// return this.trickStarter(player) == player;
	};
	this.updateHand = function(player,card){
		this.playedCards.push(card);
		_.find(players,{name:player}).throwACard(card);
	}
	// this.currentPlayerTurn = function(){
	// 	// if(counter == 0){
	// 	// 	counter++;
	// 	// 	playerTurn = this.hasTwoOfClub();
	// 	// 	return playerTurn;
	// 	// }		
	// 	playerTurn = this.nextPlayer(playerTurn);
	// 	// return playerTurn;
	// }
};



module.exports = Game;