var Player = function(name){
	var hand = [];
	this.name = name;
	this.getHand = function(){
		return hand.map(function(card){return card.getInfo()});
	};
	this.take = function(card){
		hand.push(card);
	}
};

module.exports = Player;