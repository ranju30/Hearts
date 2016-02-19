var express = require('express');
var queryString = require('querystring');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Games = require('../lib/games');
var games = new Games();

var loadUser = function(req,res,next){
	if(req.cookies.userName)
		req.user = {name:req.cookies.userName};
	next();
};
var playerLogin = function(req,res,next){
	if(req.body.userName){
		res.cookie('userName',req.body.userName);
		games.ensureJoin(req.body.userName);
		next();
	}
	else
		res	.redirect('login.html');
};
var ensureGameOn = function(req, res, next){
	games.ensureJoin(req.user.name);
	req.game = games.findByPlayer(req.user.name);
	next();
};
var ensureLoggedIn = function(req,res,next){
	if(req.user)  next();
	else res.redirect('login.html');
};

var getGameStatus = function(req,res){
	res.send(JSON.stringify(req.game.getStatus(req.user.name)));
};

var throwACard = function(req, res){
	var playerName = req.cookies.userName;
	if(req.game.isTurn(playerName) && req.game.isValidCard(playerName,req.body))
		req.game.updateHand(playerName,req.body);
	res.end();
};

var getBoardStatus = function(req, res){
	res.send(JSON.stringify(req.game.playedCards));
};

var getGameOverStatus = function(req, res){
	if(req.game.isGameOver()){
		res.send(JSON.stringify(req.game.getWinner()));
	}
	res.end();
};

var cardToBePassed = function(){
	var allPassedCards = [];
	return function(req, res){
		var playerName = req.cookies.userName;
		var detail = {name:playerName,cards:JSON.parse(req.body.cards)};
		allPassedCards.push(detail);
		req.game.hasPassed(playerName,detail.cards);
		if(allPassedCards.length == 4){
			req.game.passCardsToPlayer(allPassedCards);
			allPassedCards = [];
		}
		res.end();
	};
}();

var count = 0;
var getWinnersName = function(req, res){
	count++;
	res.end(JSON.stringify(req.game.getWinner()));
	if(count == 4){games.killGame(req.game.name);};
}

var printRequest = function(req, res, next){
	console.log(req.url);
	next();
};

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loadUser);
app.use(printRequest);


app.get('/',function(req,res){
	if(req.user)
		res.redirect('gamePage.html')
	else
		res.redirect('login.html');
});

app.post('/login',playerLogin,function(req,res){
	res.redirect('gamePage.html');
});

app.get('/gamePage.html',ensureLoggedIn);
app.use('/gameStatus',ensureLoggedIn,ensureGameOn,getGameStatus);

app.post('/selectCardToPass',ensureLoggedIn,ensureGameOn,cardToBePassed);
app.post('/startGame',ensureLoggedIn,ensureGameOn,throwACard);
app.get('/boardStatus',ensureLoggedIn,ensureGameOn,getBoardStatus);
// app.get('/gameOver',ensureLoggedIn,ensureGameOn,getGameOverStatus);
app.get('/endGame',ensureLoggedIn,ensureGameOn,getWinnersName);

app.use(express.static('./public'));

app.games = games;
module.exports = app;
