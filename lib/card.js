var Card = function(suit,rank){
	this.toString = function(){
		return [suit,rank].join(' ');
	}
};
module.exports = Card;