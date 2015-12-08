var assert = require('chai').assert;
var Player = require('../lib/player');

describe('Player',function(){
	describe('getHand',function(){
		it('gives nothing when there are no cards in hand',function(){
			var player = new Player();
			assert.equal('',player.getHand());
		})
	})
	describe('take',function(){
		it('takes a given card into the hand',function(){
			var player = new Player();
			player.take('spade A');
			assert.equal('spade A',player.getHand());
		})
	})
});