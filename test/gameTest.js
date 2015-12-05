var assert = require('chai').assert;
var _ = require('lodash');
var Game = require('../lib/game');
var players = [
	{name:'player1',take:function(){}},
	{name:'player2',cards:[],take:function(card){
		players[1].cards.push(card);
	},getCards:function(){return players[1].cards}},
	{name:'player3',take:function(){}},
	{name:'player4',take:function(){}}];

describe('game',function(){
	describe('getStatus',function(){
		it('gives player names, instruction & my location',function(){
			var game = new Game(players);
			var status = game.getStatus('player2');
			assert.equal('Please select 3 cards to pass',status.instruction);
			assert.deepEqual(['player1','player2','player3','player4'],status.players);
			assert.equal(1,status.location);
		})
	}),
	describe('deal',function(){
		it('gives 13 cards to each player',function(){
			var cards = _.range(52);
			var game = new Game(players);
			var dontShuffle = function(x){return x};
			game.deal(cards,dontShuffle);
			var status = game.getStatus('player2');
			assert.deepEqual(_.range(1,52,4),status.cards); 
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

