var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('lodash');
var Game = require('../lib/game');
var player2 = {name:'player2',take:sinon.spy(),getHand:sinon.stub()};
var players = [
	{name:'player1',take:function(){}},
	player2,
	{name:'player3',take:function(){}},
	{name:'player4',take:function(){}}];

describe('game',function(){
	describe('getStatus',function(){
		it('gives player names, instruction & my location',function(){
			var game = new Game(players);
			player2.getHand.returns('ola');

			var status = game.getStatus('player2');
			assert.equal('Please select 3 cards to pass',status.instruction);
			assert.deepEqual(['player1','player2','player3','player4'],status.players);
			assert.equal('ola',status.hand);
			assert.equal(1,status.location);
		})
	}),
	describe('deal',function(){
		it('gives 13 cards to each player',function(){
			var game = new Game(players);
			var pack = {shuffle:sinon.spy(),drawOne:sinon.spy()};
			game.deal(pack);
			assert.ok(pack.shuffle.calledOnce);
			assert.ok(pack.drawOne.callCount,52);
			assert.ok(player2.take.callCount,13);
		})
	}),
	describe('exists',function(){
		it('tells no when absent',function(){
			var game = new Game(players);
			assert.notOk(game.exists('player5'));
		}),
		it('tells yes when present',function(){
			var game = new Game(players);
			assert.ok(game.exists('player1'));
		})
	})
});

