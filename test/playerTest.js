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
			var card = {suit:'spade',rank:'A',getInfo:sinon.stub().returns({suit:'spade',rank:'A'})};
			player.take(card);
			var card1 = {suit:'heart',rank:'10',getInfo:sinon.stub().returns({suit:'heart',rank:'10'})};
			player.take(card1);
			assert.deepEqual([{ suit: 'spade', rank: 'A' },{ suit: 'heart', rank: '10' } ],player.getHand());
			player.throwACard(card);
			assert.deepEqual([{suit:'heart',rank:'10'}],player.getHand());
		});
	});
	describe('calculatePoints',function(){
		it('should calculate points of a player after each trick',function(){
			var player = new Player();
			player.calculatePoints(13);
			assert.equal(13,player.getPoints());
			player.calculatePoints(1);
			assert.equal(14,player.getPoints());
		});
	});
	describe('calculateTotalPoints',function(){
		it('should calculate total points of a player after every round',function(){
			var player = new Player();
			player.calculatePoints(13);
			assert.equal(13,player.getPoints());
			player.calculatePoints(1);
			assert.equal(14,player.getPoints());
			player.calculateTotalPoints();
			assert.equal(14,player.getTotalPoints());
		});
	});
	describe('sortCards',function(){
		it('should sort the available cards in player hand',function(){
			var player = new Player();
			var card1 = {suit:'spade',rank:'A',getInfo:sinon.stub().returns({suit:'spade',rank:'A'})};
			player.take(card1);
			var card2 = {suit:'heart',rank:'10',getInfo:sinon.stub().returns({suit:'heart',rank:'10'})};
			player.take(card2);
			var card3 = {suit:'diamond',rank:'6',getInfo:sinon.stub().returns({suit:'diamond',rank:'6'})};
			player.take(card3);
			var card4 = {suit:'club',rank:'7',getInfo:sinon.stub().returns({suit:'club',rank:'7'})};
			player.take(card4);
			assert.deepEqual([{suit:'club',rank:'7'},{suit:'diamond',rank:'6'},{suit:'spade',rank:'A'},{suit:'heart',rank:'10'}],player.getHand());
			
		});
	});
});
