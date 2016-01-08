var _ = require('lodash');
var Game = function(pack){
	var self = this;
	var players = [];
	var round = 1;
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
		if(round == 1 && this.playedCards.length == 0)
			return card.suit == 'club' && card.rank == '2';
		else if(round > 1 && this.playedCards.length != 0)
			return card.suit == this.playedCards[0].suit;
		return true;
	};
	this.isTurn = function(player){
		return player == playerTurn;
	};
	this.trickOwner = function(){
		var owner = this.playedCards[0];
		this.playedCards.forEach(function(card){
			if(owner.priority < card.priority && owner.suit == card.suit)
				owner = card;
		});
		return owner.playerName;
	};
	this.calculateScore = function(player){
		var trickOwnerPlayer = _.find(players,{name:player});
		var scoreGain = 0;
		this.playedCards.forEach(function(card){
			if(card.suit == 'heart')
				scoreGain += 1;
			else if(card.suit == 'spade' && card.rank == 'Q')
				scoreGain += 13;
		})
		trickOwnerPlayer.points += scoreGain;
	};

	this.updateHand = function(player,card){
		if(this.isValidCard(card) && round++){
			card.playerName = player;
			card.priority = generatePriority(card.rank);
			this.playedCards.push(card);
			_.find(players,{name:player}).throwACard(card);
			if(this.playedCards.length < 4){
				playerTurn = this.nextPlayer(player);
			}
			else{
				playerTurn = this.trickOwner();
				this.calculateScore(playerTurn);
				var self = this;
				setTimeout(function(){self.playedCards = []},1000);
			}
		}
	};
};

var generatePriority = function(rank){
	if(rank <= 10)
		return +rank;
	else if(rank == 'J')
		return 11;
	else if(rank == 'Q')
		return 12;
	else if(rank == 'K')
		return 13;
	else
		return 14;
};



module.exports = Game;