var _ = require('lodash');
var Pack = require('./pack');
var Game = function(){
	var self = this;
	var players = [];
	var step = 1;
	var trick = 1;
	var round = 1;
	var heartBroken = false;
	var playerTurn;
	var pass = false;
	
	this.playedCards = [];
	this.name = new Date().getTime();
	this.getNumberOfPlayers = function(){
		return players.length;
	};

	this.join = function(player){
		players.push(player);
		if(players.length==4)
			setTimeout(function(){ deal();},1000);	
	};

	var hasTwoOfClub = function(){
		var starterPlayer = players.filter(function(player){
			return _.find(player.getHand(),{suit:'club',rank:'2'});
		});
		return starterPlayer[0].name;
	};

	var deal = function(){
		var pack = new Pack();
		pack.shuffle();
		var distribute = function(index){
			players[index%4].take(pack.drawOne());
		};
		_.times(52,distribute);
		trick = 1;
		if (round%4 == 0) {
			playerTurn = hasTwoOfClub();
		};
	};

	this.getStatus = function(player){
		var name = player == playerTurn ? 'Your' : playerTurn + "'s";
		var currentPlayer = _.find(players,{name:player});
		var currentPlayerIndex = players.indexOf(currentPlayer);
		if(players.length == 4){
			var playerToPass = players[(currentPlayerIndex+(round%4))%4].name;
		}
		var result = {
			players: players.map(function(p){return {name:p.name,pass:p.pass,points:p.getPoints(),total:p.getTotalPoints()}}),
			location:_.pluck(players,'name').indexOf(player),
			hand: _.find(players,{name:player}).getHand(),
			playedCard: this.playedCards,
			passed:pass,
			round:round,
		};
		if(players.length<4){
			result.instruction = 'Waiting for ' + (4-players.length) + ' players';			
		}
		else if(!currentPlayer.pass && players.length == 4 && playerTurn == undefined){
			result.instruction = 'Select 3 Cards and pass to ' + playerToPass;
		}
		else if(currentPlayer.pass && players.length == 4 && playerTurn == undefined){
			result.instruction = "Wait for other players to pass";
		}
		else{
			result.instruction = name + " turn";
		}

		result.isGameOver = this.isGameOver();
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

	this.hasCurrentSuit = function(currentSuit,player){
		var currentPlayerHand = _.find(players,{name:player}).getHand();
		return currentPlayerHand.some(function(card){
			return card.suit == currentSuit;
		});
	};

	this.isNotAPenaltyCard = function(card){
		if(card.suit == 'heart')
			return false;
		else if(card.suit == 'spade' && card.rank == 'Q')
			return false;
		return true;
	};

	this.hasOnlyHeart = function(player){
		var currentPlayerHand = _.find(players,{name:player}).getHand();
		return currentPlayerHand.every(function(card){
			return card.suit == 'heart';
		});
	}

	this.isValidCard = function(player,card){
		if(trick == 1){
			if(step > 1){
				if(this.hasCurrentSuit(this.playedCards[0].suit,player)){
					return card.suit == this.playedCards[0].suit;
				}
				else if(this.isNotAPenaltyCard(card)){
					return true;
				}
			}
			return card.suit == 'club' && card.rank == '2';
		}
		else if(step == 1 && card.suit == 'heart'){
			if(this.hasOnlyHeart(player)) {heartBroken = true};
			return heartBroken;
		}
		else if(step > 1 && this.hasCurrentSuit(this.playedCards[0].suit,player))
			return card.suit == this.playedCards[0].suit;
		else
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

	this.isGameOver = function(){
		return players.some(function(player){
			return player.getTotalPoints() >= 10;
		});
	};

	this.getWinner = function(){
		var sortedPlayer = players.sort(function(previousPlayer,nextPlayer){
			return nextPlayer.getTotalPoints() - previousPlayer.getTotalPoints();
		});
		var allPlayersPoint = [];

		sortedPlayer.reverse().forEach(function(player){
			allPlayersPoint.push({player : player.name, points : player.getTotalPoints()});
		});

		return allPlayersPoint;
	};

	this.isMoonShoot = function(){
		return players.some(function(player){
			return player.getPoints() == 26;
		})
	};

	var restartGame = function(){
		round++;
		heartBroken = false;
		playerTurn = undefined;
		pass = false;
		players.forEach(function(player){
			player.pass = false;
		});
	};

	this.addPenaltyPointsToOther = function(){
		var moonShooter;
		players.forEach(function(player){
			if(player.getPoints() == 26)
				moonShooter = player;
		});
		players.forEach(function(player){
			if(player.name != moonShooter.name){
				player.calculatePoints(26);
				player.calculateTotalPoints();
				player.calculatePoints(-26);
			}
			else{
				player.calculatePoints(-26);
				player.calculateTotalPoints();
			};
		});
		restartGame();
	};

	this.addTotalPoints = function(){
		players.forEach(function(eachPlayer){
			eachPlayer.calculateTotalPoints();
			eachPlayer.calculatePoints(-eachPlayer.getPoints());
		});
		restartGame();
	};

	this.calculateTrickPoint = function(player){
		var trickOwnerPlayer = _.find(players,{name:player});
		var scoreGain = 0;
		this.playedCards.forEach(function(card){
			if(card.suit == 'heart'){
				heartBroken = true;
				scoreGain += 1;
			}
			else if(card.suit == 'spade' && card.rank == 'Q')
				scoreGain += 13;
		});
		trickOwnerPlayer.calculatePoints(scoreGain);
		trick++;
		step = 1;
		if(trick > 2){
			if(this.isMoonShoot()){
				this.addPenaltyPointsToOther();
			}
			else{
				this.addTotalPoints();
			}
			if(!this.isGameOver()){
				setTimeout(function(){deal();},1500);
			}
		}
	};
	this.updateHand = function(player,card){
		if(this.isValidCard(player,card) && step++){
			card.playerName = player;
			card.priority = generatePriority(card.rank);
			this.playedCards.push(card);
			_.find(players,{name:player}).throwACard(card);
			if(this.playedCards.length < 4){
				playerTurn = this.nextPlayer(player);
			}
			else{
				playerTurn = this.trickOwner();
				this.calculateTrickPoint(playerTurn);
				var self = this;
				setTimeout(function(){self.playedCards = []},1500);
			}
		}
	};
	this.passCardsToPlayer = function(passedCards){
		passedCards.forEach(function(detail){
			var currentPlayer = _.find(players,{name:detail.name});
			var currentPlayerIndex = players.indexOf(currentPlayer);
			players[(currentPlayerIndex+(round%4))%4].addPassedCards(detail.cards);
		});
		pass = true;
		playerTurn = hasTwoOfClub();
	};
	this.hasPassed = function(player,cards){
		var passedPlayer = _.find(players,{name:player});
		passedPlayer.pass = true;
		passedPlayer.removePassedCards(cards);
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