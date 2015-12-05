var assert = require('chai').assert;
var GameSetup = require('../lib/gameSetup');
describe('gameSetup',function(){
	describe('is not Ready',function(){
		it('when newly created',function(){
			var setup = new GameSetup();
			assert.notOk(setup.isReady());
		}),
		it('when a player joins',function(){
			var setup = new GameSetup();
			setup.join('player1');
			assert.notOk(setup.isReady());
		})
	}),
	describe('isReady',function(){
		it('after 4 players join',function(){
			var setup = new GameSetup();
			setup.join('player1');
			setup.join('player2');
			setup.join('player3');
			setup.join('player4');
			assert.ok(setup.isReady());
		})
	})
	
	it('throws error when the 5th player joins',function(){
		var setup = new GameSetup();
		setup.join('player1');
		setup.join('player2');
		setup.join('player3');
		setup.join('player4');
		assert.ok(setup.isReady());
		assert.throws(function(){setup.join('player5')},Error,'4 Players have already joined');
	}),
	describe('listPlayers',function(){
		it('gives a list of joined players',function(){
			var setup = new GameSetup();
			setup.join('player1');
			setup.join('player2');
			assert.deepEqual(['player1','player2'],setup.listPlayers());
		}),
		it('gives empty list when there are no joined players',function(){
			var setup = new GameSetup();
			assert.deepEqual([],setup.listPlayers());
		})
	}),
	describe('leave',function(){
		it('removes the player from the setup',function(){
			var setup = new GameSetup();
			setup.join('player1');
			setup.join('player2');
			setup.leave('player2');
			assert.deepEqual(['player1'],setup.listPlayers());
		})
	}),
	describe('exists',function(){
		it('tells no when absent',function(){
			var setup = new GameSetup();
			assert.notOk(setup.exists('player1'));
		}),
		it('tells yes when present',function(){
			var setup = new GameSetup();
			setup.join('player1');
			assert.ok(setup.exists('player1'));
		})
	})
});