var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('lodash');
var Game = require('../lib/game');
var player2 = {name:'player2',take:sinon.spy(),getHand:sinon.stub()};
var players = [
	{name:'player1',take:function(){},getHand:sinon.stub().returns([{suit:'club',rank:'2'}])},
	player2,
	{name:'player3',take:function(){},getHand:function(){}},
	{name:'player4',take:function(){},getHand:function(){}}];
var dummyPack = {shuffle:function(){},drawOne:function(){}};
describe('game',function(){
	describe('getStatus',function(){
		it('gives first player name and instructs to wait for others when game has not started',function(){
			var game = new Game();
			var player1 = {name:'player1',getHand:sinon.stub().returns('ola')};
			game.join(player1);
			var status = game.getStatus('player1');
			assert.equal('Waiting for other players',status.instruction);
			assert.deepEqual([{name:'player1',points:0}],status.players);
			assert.equal('ola',status.hand);
			assert.equal(0,status.location);
		});
		it('gives player names, instruction & my location',function(){
			var game = new Game(dummyPack);
			players.forEach(function(p){game.join(p)});
			var status = game.getStatus('player2');
			assert.equal("player1's turn",status.instruction);
			assert.equal(1,status.location);
		});
	});
	describe('join of 4 players',function(){
		it('deals the pack & gives 13 cards to each player',function(){
			var pack = {shuffle:sinon.spy(),drawOne:sinon.spy()};
			var game = new Game(pack);
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
			var game = new Game(dummyPack);
			game.name = 'firstGame';
			players.forEach(function(p){game.join(p)});
			assert.deepEqual({name:'firstGame',players:['player1','player2','player3','player4']},game.summary);
		});
	});
	describe('hasTwoOfClub',function(){
		it('tells which player have club-2 in hand',function(){
			var game = new Game(dummyPack);
			players.forEach(function(p){game.join(p)});
			assert.equal(game.hasTwoOfClub(),'player1');
			assert.notEqual(game.hasTwoOfClub(),'player2');
		});
	});
	describe('trickStarter',function(){
		it('tells about the player who will start the trick',function(){
			var game = new Game(dummyPack);
			players.forEach(function(p){game.join(p)});
			assert.equal(game.trickStarter(),'player1');
			assert.notEqual(game.trickStarter(),'player2');
		});
	});
	describe('nextPlayer',function(){
		it('gives the player next to the current player',function(){
			var game = new Game(dummyPack);
			players.forEach(function(p){game.join(p)});
			assert.equal(game.nextPlayer('player1'),'player2');
			assert.equal(game.nextPlayer('player3'),'player4');
			assert.equal(game.nextPlayer('player4'),'player1');
		});
	});
});

