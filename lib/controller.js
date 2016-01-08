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
	console.log('Setting a cookie:',req.body.userName)
	if(req.body.userName){
		res.setHeader("Set-Cookie", ["userName="+req.body.userName]);
		games.ensureJoin(req.body.userName);
		next();
	}
	else
		res.redirect('login.html');
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
	if(req.game.isTurn(playerName,req.body))
		req.game.updateHand(playerName,req.body);
	res.end();
};

var getBoardStatus = function(req, res){
	res.send(JSON.stringify(req.game.playedCards));
};

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loadUser);

app.get('/',function(req,res){
	if(req.user)
		res.redirect('game.html')
	else
		res.redirect('login.html');
});

app.post('/login',playerLogin,function(req,res){
	res.redirect('game.html');
});

app.get('/logout',function(req,res){
	res.setHeader("Set-Cookie", '');
	console.log('Cookie after logout:',req.body.userName);
	res.redirect('login.html');
});

app.get('/game.html',ensureLoggedIn);
app.use('/gameStatus',ensureLoggedIn,ensureGameOn,getGameStatus);

app.post('/startGame',ensureGameOn,throwACard);
app.get('/boardStatus',ensureGameOn,getBoardStatus);

app.use(express.static('./public'));

app.games = games;
module.exports = app;
