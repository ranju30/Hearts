var express = require('express');
var queryString = require('querystring');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var Games = require('../lib/games');
var games = new Games();

passport.use(new FacebookStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://hearts-ranju30.rhcloud.com/game.html"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


var loadUser = function(req,res,next){
	if(req.cookies.userName)
		req.user = {name:req.cookies.userName};
	next();
};
var playerLogin = function(req,res,next){
	console.log('Setting a cookie:',req.body.userName);
	games.ensureJoin(req.body.userName);
};
var ensureGameOn = function(req, res, next){
	games.ensureJoin(req.user.name);
	req.game = games.findByPlayer(req.user.name);
	next();
};
var ensureLoggedIn = function(req,res,next){
	
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

var getWinnersName = function(req, res){
	if(req.game.isGameOver()){
		res.send(JSON.stringify(req.game.getWinner()));
	}
	else{
		res.send(JSON.stringify({end:false}));
	}
	res.end();
}

var deleteCookie = function(req, res, next){
	res.clearCookie('userName');
	next();
};

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loadUser);

app.use(passport.initialize());
app.use(passport.session());


app.get('/',function(req,res){
	if(req.user)
		res.redirect('gamePage.html')
	else
		res.redirect('login.html');
});

app.get('/logout',deleteCookie,function(req,res){
	req.cookies.userName = undefined;
	res.redirect('login.html');
});

app.post('/login',passport.authenticate('facebook'));



app.get('/game.html',passport.authenticate('facebook', { failureRedirect: '/login' }),function(req, res, next){
	res.cookie('userName', req.user.displayName);
	res.redirect('/gamePage.html');
});

app.use('/gameStatus',ensureGameOn,getGameStatus);

app.post('/selectCardToPass',ensureGameOn,cardToBePassed);
app.post('/startGame',ensureGameOn,throwACard);
app.get('/boardStatus',ensureGameOn,getBoardStatus);
app.get('/gameOver',ensureGameOn,getGameOverStatus);
app.get('/endGame',ensureGameOn,getWinnersName);

app.use(express.static('./public'));

app.games = games;
module.exports = app;
