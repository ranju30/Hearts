var expect = require('chai').expect;
var playerLib = require('../public/javaScript/player.js').lib;

describe('Player',function(){
	var player = new playerLib.Player('anjaly');
	it('should have properties',function(){
		expect(player).to.have.all.keys('playerID');
	});
});