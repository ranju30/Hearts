var assert = require('chai').assert;
var sinon = require('sinon');
var Player = require('../lib/player');

describe('Player',function(){
	describe('getHand',function(){
		it('gives nothing when there are no cards in hand',function(){
			var player = new Player();
			assert.deepEqual([],player.getHand());
		})
	})
	describe('take',function(){
		it('takes a given card into the hand',function(){
			var player = new Player();
			var card = {getInfo:sinon.stub().returns({suit:'spade',rank:'A'})};
			player.take(card);
			assert.deepEqual([{suit:'spade',rank:'A'}],player.getHand());
		})
	})
});