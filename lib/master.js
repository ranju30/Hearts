var deckOfCards = require('./cardGenerator.js').lib;
var ld = require('lodash');
var master = {};

master.shuffle52Cards = ld.shuffle(deckOfCards.generateDeckOf52Cards());


master.distribute52Cards = function (players,cards) {
	for (var i = 0; i < 13; i++) {
		players.forEach(function (player) {
			if (i==0){
				player['cards']= [];
			};
			player['cards'].push(cards.shift());
		})
	};
	return players;
};
exports.master = master;
