var Card = function(suit,rank){
	this.getInfo = function(){
		return {suit:suit,rank:rank};
	}
};
module.exports = Card;