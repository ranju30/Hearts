var expect = require('chai').expect;
var playerLib = require('../lib/player.js').lib;
var masterLib = require('../lib/master.js').master;

describe('shuffle',function(){
	it('should have 52 cards',function(){
		expect(52).to.equal(masterLib.shuffle52Cards.length);
	});
});

describe('distribute 52 cards', function(){
	var players = ['anjaly','ranju','sanjit','shruti'].map(function(player){
		return new playerLib.Player(player);
	});
	it('should have 2 properties',function(){
		var playersWithCards = masterLib.distribute52Cards(players,masterLib.shuffle52Cards);
		expect(playersWithCards[0]).to.have.all.keys('playerID','cards');
	})
	it('should give 4 players',function(){
		expect(4).to.equal(players.length);
	});
	it('should give 13 cards to each player', function(){
	var playersWithCards = masterLib.distribute52Cards(players,masterLib.shuffle52Cards);
		expect(13).to.equal(playersWithCards[0]['cards'].length);
	});
});