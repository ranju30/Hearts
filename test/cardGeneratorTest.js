var expect = require('chai').expect;
var cardLib = require('../lib/cardGenerator.js').lib;


describe('cardGenerator',function(){
	it('should have 3 properties', function(){
		var card = new cardLib.Card('Ace',13,'Heart');
		expect(card).to.have.all.keys('name','rank','suit');
	});
	it('should have 52 cards', function(){
		expect(52).to.equal(cardLib.generateDeckOf52Cards().length)
	});
});