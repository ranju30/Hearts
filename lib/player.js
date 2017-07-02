var _ = require("lodash");
var Card = require("./card");
var Player = function (name) {
	var hand = [];
	this.name = name;
	this.pass = false;
	var points = 0;
	var totalPoints = 0;

	this.getHand = function () {
		sortCards(hand);
		return hand.map(function (card) {
			if (card) return card.getInfo();
		});
	};
	this.take = function (card) {
		hand.push(card);
	};
	this.throwACard = function (playedCard) {
		var removedCard = _.remove(hand, function (card) {
			var info = card.getInfo();
			return playedCard.suit == info.suit && playedCard.rank == info.rank;
		});
		return removedCard;
	};
	this.calculatePoints = function (point) {
		points += point;
	};
	this.getPoints = function () {
		return points;
	};
	this.calculateTotalPoints = function () {
		totalPoints += points;
	};
	this.getTotalPoints = function () {
		return totalPoints;
	};
	var sortCards = function (cards) {
		var clubs = _.filter(cards, function (card) {
			return card.getInfo().suit == "club";
		});
		hand = clubs;
		var diamonds = _.filter(cards, function (card) {
			return card.getInfo().suit == "diamond";
		});
		hand = hand.concat(diamonds);
		var spades = _.filter(cards, function (card) {
			return card.getInfo().suit == "spade";
		});
		hand = hand.concat(spades);
		var hearts = _.filter(cards, function (card) {
			return card.getInfo().suit == "heart";
		});
		hand = hand.concat(hearts);
	};
	this.removePassedCards = function (cards) {
		cards.forEach(function (passedCard) {
			_.remove(hand, function (card) {
				var info = card.getInfo();
				return passedCard.suit == info.suit && passedCard.rank == info.rank;
			});
		});
	};
	this.addPassedCards = function (cards) {
		var self = this;
		cards.forEach(function (card) {
			var madeCard = new Card(card.suit, card.rank);
			self.take(madeCard);
		});
	};
};

module.exports = Player;


