var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('lodash');
var Game = require('../lib/game');
var player2 = {name:'player2',
				calculatePoints:function(){},
				getPoints:function(){},
				throwACard:function(){},
				take:sinon.spy(),getHand:sinon.stub().returns([{suit:'heart',rank:'K'}])};

var players = [
	{name:'player1',
		calculatePoints:function(){},
		getPoints:function(){},
		take:function(){},
		getHand:sinon.stub().returns([{suit:'club',rank:'2'},{suit:'diamond',rank:'A'},{suit:'heart',rank:'A'}]),
		throwACard:function(){}},
	player2,
	{name:'player3',
		calculatePoints:function(){},
		getPoints:function(){},
		take:function(){},
		getHand:sinon.stub().returns([{suit:'diamond',rank:'3'},{suit:'club',rank:'3'}]),
		throwACard:function(){}},
	{name:'player4',
		calculatePoints:function(){},
		getPoints:function(){},
		take:function(){},
		throwACard:function(){},
		getHand:sinon.stub().returns([{suit:'diamond',rank:'4'},{suit:'club',rank:'4'}])}
	];

describe('game',function(){
	describe('getStatus',function(){
		it('gives first player name and instructs to wait for others when game has not started',function(){
			var game = new Game();
			var player1 = {name:'player1',getHand:sinon.stub().returns('ola'),calculatePoints:function(){},getPoints:function(){}};
			game.join(player1);
			var status = game.getStatus('player1');
			assert.equal('Waiting for 3 players',status.instruction);
			assert.deepEqual([{name:'player1',points:player1.getPoints()}],status.players);
			assert.equal('ola',status.hand);
			assert.equal(0,status.location);
		});
		it('gives player names, instruction & my location',function(){
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			var status = game.getStatus('player2');
			assert.equal("player1's turn",status.instruction);
			assert.equal(1,status.location);
		});
	});
	describe.skip('join of 4 players',function(){
		it('deals the pack & gives 13 cards to each player',function(){
			var pack = {shuffle:sinon.spy(),drawOne:sinon.spy()};
			var game = new Game();
			players.forEach(function(p){game.join(p)});
			assert.ok(pack.shuffle.calledOnce);
			assert.ok(pack.drawOne.callCount,52);
			assert.ok(player2.take.callCount,13);
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
});

