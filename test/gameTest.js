var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('lodash');
var Game = require('../lib/game');
var playerWithHeart;
var player2 = {name:'player2',
				calculatePoints:sinon.spy(),
				calculateTotalPoints:sinon.spy(),
				getPoints:sinon.stub().returns(26),
				throwACard:function(){},
				addPassedCards:sinon.spy(),
				removePassedCards:sinon.spy(),
				getTotalPoints:sinon.stub().returns(40),
				take:sinon.spy(),getHand:sinon.stub().returns([{suit:'heart',rank:'K'}])};

var players = [
	{name:'player1',
		calculatePoints:sinon.spy(),
		calculateTotalPoints:sinon.spy(),
		addPassedCards:sinon.spy(),
		removePassedCards:sinon.spy(),
		getPoints:function(){},
		take:function(){},
		getTotalPoints:sinon.stub().returns(7),
		getHand:sinon.stub().returns([{suit:'club',rank:'2'},{suit:'diamond',rank:'A'},{suit:'heart',rank:'A'}]),
		throwACard:function(){}},
	player2,
	{name:'player3',
		calculatePoints:sinon.spy(),
		calculateTotalPoints:sinon.spy(),
		addPassedCards:sinon.spy(),
		removePassedCards:sinon.spy(),
		getPoints:function(){},
		take:function(){},
		getTotalPoints:sinon.stub().returns(70),
		getHand:sinon.stub().returns([{suit:'diamond',rank:'3'},{suit:'club',rank:'3'}]),
		throwACard:function(){}},
	{name:'player4',
		calculatePoints:sinon.spy(),
		calculateTotalPoints:sinon.spy(),
		addPassedCards:sinon.spy(),
		removePassedCards:sinon.spy(),
		getPoints:function(){},
		take:function(){},
		throwACard:function(){},
		getTotalPoints:sinon.stub().returns(90),
		getHand:sinon.stub().returns([{suit:'diamond',rank:'4'},{suit:'club',rank:'4'}])}
	];

describe('game',function(){
	describe('getStatus',function(){
		it('gives first player name and instructs to wait for others when game has not started',function(){
			var game = new Game();
			var player1 = {name:'player1',getHand:sinon.stub().returns('ola'),calculatePoints:function(){},getPoints:function(){},getTotalPoints:function(){}};
			game.join(player1);
			var status = game.getStatus('player1');
			assert.equal('Waiting for 3 players',status.instruction);
			assert.deepEqual([{name:'player1',pass:undefined,points:player1.getPoints(),total:player1.getTotalPoints()}],status.players);
			assert.equal('ola',status.hand);
			assert.equal(0,status.location);
		});
		it('gives player names, instruction & my location',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			var status = game.getStatus('player2');
			assert.equal("Select 3 Cards and pass to player3",status.instruction);
			assert.equal(1,status.location);
		});
	});
	describe('exists',function(){
		it('tells no when absent',function(){
			var player1 = {name:'player1'}
			var game = new Game();
			game.join(player1);
			assert.notOk(game.exists('player5'));
		});
		it('tells yes when present',function(){
			var player1 = {name:'player1'}
			var game = new Game();
			game.join(player1);
			assert.ok(game.exists('player1'));
		});
	});
	describe('summary',function(){
		it('gives the name & players in the game',function(){
			var game = new Game();
			game.name = 'firstGame';
			players.forEach(function(p){game.join(p)});
			assert.deepEqual({name:'firstGame',players:['player1','player2','player3','player4']},game.summary);
		});
	});
	describe('nextPlayer',function(){
		it('gives the player next to the current player',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.equal(game.nextPlayer('player1'),'player2');
			assert.equal(game.nextPlayer('player3'),'player4');
			assert.equal(game.nextPlayer('player4'),'player1');
		});
	});
	describe('isTurn',function(){
		it('should validate the given card for the card to be played and return false',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			game.isTurn('player1');
			game.updateHand('player1',{suit:'club',rank:'2'});
			assert.notOk(game.isTurn('player3'));
		});
	});
	describe('updateHand',function(){
		it('should update the hand of the player according to the card he played',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			game.updateHand('player1',{suit:'club',rank:'2'});
			assert.deepEqual([{suit:'club',rank:'2',playerName: "player1",priority: 2}],game.playedCards);
		});
		it('should allow to play a card if suit is same',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			game.updateHand('player1',{suit:'club',rank:'2'});
			assert.deepEqual([{suit:'club',rank:'2',playerName: "player1",priority: 2}],game.playedCards);
			game.updateHand('player3',{suit:'club',rank:'K'});
			assert.deepEqual([{suit:'club',rank:'2',playerName: "player1",priority: 2},{suit:'club',rank:'K',playerName: "player3",priority: 13}],game.playedCards);
		});
	});
	describe('isValidCard',function(){
		it('should return true if played card is from same suit',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.ok(game.isValidCard('player1',{suit:'club',rank:'2'}));
		});
		it('should return false if played card is not from same suit',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.notOk(game.isValidCard('player1',{suit:'heart',rank:'7'}));
		});
	});
	describe('trickOwner',function(){
		it('should change the player turn according to the owner of the trick',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			game.updateHand('player1',{suit:'club',rank:'2'});
			game.updateHand('player2',{suit:'club',rank:'K'});
			game.updateHand('player3',{suit:'club',rank:'3'});
			game.updateHand('player4',{suit:'club',rank:'4'});
			assert.deepEqual(game.trickOwner(),'player2');		
			assert.notEqual(game.trickOwner(),'player4');		
		});
	});
	describe('hasCurrentSuit',function(){
		it('should return true if a player have the running suit in hand',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.ok(game.hasCurrentSuit('club','player1'));
		});
		it('should return false if a player donot have running suit',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.notOk(game.hasCurrentSuit('spade','player1'));
		});
	});
	describe('isNotAPenaltyCard',function(){
		it('return true if it is not a penalty card',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.ok(game.isNotAPenaltyCard({rank:'2',suit:'club'}));
		});
		it('return false if it is a penalty card of any heart card',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.notOk(game.isNotAPenaltyCard({rank:'2',suit:'heart'}));
		});
		it('return false if it is a penalty card of spade Q',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.notOk(game.isNotAPenaltyCard({rank:'Q',suit:'spade'}));
		});
	});
	describe('hasOnlyHeart',function(){
		it('return true if a player has only hearts card in hand',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.notOk(game.hasOnlyHeart('player1'));
			assert.ok(game.hasOnlyHeart('player2'));
		});
	});
	describe('isGameOver',function(){
		it('returns true if any 1 player gets 100 point',function(){
			var game = new Game();
			var allPlayers = [{name:'p1',getTotalPoints:sinon.stub().returns(110)},{name:'p2',getTotalPoints:function(){}}]
			allPlayers.forEach(function(p){game.join(p)});
			assert.ok(game.isGameOver());			
		});
		it('returns false if all player point is less than 100 point',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.notOk(game.isGameOver());			
		});
	});
	describe('getWinner',function(){
		it('returns the player name who has the less points',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.deepEqual({winner:'Winner is : player1'},game.getWinner());
		});
	});
	describe('isMoonShoot',function(){
		it('returns true if a player score 26 in one round',function(){
			var game = new Game();
			var allPlayers = [{name:'p1',getPoints:sinon.stub().returns(26)},{name:'p2',getPoints:function(){}}]
			allPlayers.forEach(function(p){game.join(p)});
			assert.ok(game.isMoonShoot());
		});
		it('returns return false if any player dont get 26',function(){
			var game = new Game();
			var allPlayers = [{name:'p1',getPoints:sinon.stub().returns(25)},{name:'p2',getPoints:function(){}}]
			allPlayers.forEach(function(p){game.join(p)});
			assert.notOk(game.isMoonShoot());
		});
	});
	describe('addPenaltyPointsToOther',function(){
		it('if moon is hitted check relevent functions are called for who have not hit moon',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			game.addPenaltyPointsToOther();
			assert.equal(players[0].calculatePoints.callCount,2);
			assert.equal(players[0].calculateTotalPoints.callCount,1);
		});
		it('if moon is hitted check relevent functions are called who hit moon',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			game.addPenaltyPointsToOther();
			assert.equal(players[1].calculatePoints.callCount,3);
			assert.equal(players[1].calculateTotalPoints.callCount,2);
		});
	});
	describe('addTotalPoints',function(){
		it('check when function is called relevant function should called',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			game.addTotalPoints();
			assert.equal(players[3].calculateTotalPoints.callCount,3);
			assert.equal(players[3].calculatePoints.callCount,5);
		});
	});
	describe('passCardsToPlayer',function(){
		it('it calls relevant function for fixed time',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			var detail = [{name:'player1',cards:[]},{name:'player2',cards:[]}]
			game.passCardsToPlayer(detail);
			assert.equal(players[0].removePassedCards.callOnce);
			assert.equal(players[0].addPassedCards.callOnce);
		});
	});
	describe("firstStepAndHeartValidator",function(){
		it('should validate a card for step one',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.ok(game.firstStepAndHeart({suit:'heart'}));
		});
	})
	describe("isAbleToPlayHeart",function(){
		it('should validate a card for a heart card',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.ok(game.isAbleToPlayHeart(player2.name));
		});
	})
	describe("isValidateForStepAboveOne",function(){
		it('should validate a card for steps more than one',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.ok(game.isAbleToPlayHeart(player2.name));
		});
	});
	
	/*have to increase step to test this method*/
	
	// describe("isValidForStepAboveOneAndCurrentSuit",function(){
	// 	it("should validate a card for step above one",function(){
	// 		var game = new Game();
	// 		players.forEach(function(p){game.join(p)});
	// 		assert.ok(game.isValidForStepAboveOneAndCurrentSuit(players[1]));
	// 	})
	// })
});

