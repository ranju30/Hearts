var _ = require("lodash");
var Card = require("./card");
var suit = "spade,heart,diamond,club".split(",");
var rank = "A,2,3,4,5,6,7,8,9,10,J,Q,K".split(",");
var Pack = function(){
	var cards = [];
	suit.forEach(function(s){
		rank.forEach(function(r){
			cards.push(new Card(s,r));
		});
	});
	this.isNotEmpty = function(){
		return cards.length>0;
	};
	this.drawOne = function(){
		return cards.shift();
	};
	this.shuffle = function(){
		cards = _.shuffle(cards);
	};
};
module.exports = Pack;