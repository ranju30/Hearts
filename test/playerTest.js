var assert = require('chai').assert;
var sinon = require('sinon');
var Player = require('../lib/player');

describe('Player',function(){
	describe('getHand',function(){
		it('gives nothing when there are no cards in hand',function(){
			var player = new Player();
			assert.deepEqual([],player.getHand());
		});
	});
	describe('take',function(){
		it('takes a given card into the hand',function(){
			var player = new Player();
			var card = {getInfo:sinon.stub().returns({suit:'spade',rank:'A'})};
			player.take(card);
			assert.deepEqual([{suit:'spade',rank:'A'}],player.getHand());
		});
	});
	describe('throwACard',function(){
		it('throws selected card on the board',function(){
			var player = new Player();
			var card = {suit:'spade',rank:'A'};
			player.take(card);
			var card1 = {suit:'heart',rank:'10'};
			player.take(card1);
			assert.deepEqual([{suit:'spade',rank:'A'},{suit:'heart',rank:'10'}],player.hand);
			player.throwACard(card);
			assert.deepEqual([{suit:'heart',rank:'10'}],player.hand);
		});
	});
});