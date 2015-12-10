var fs = require('fs');
var querystring = require('querystring');
var ld = require('lodash');
var cookieReader = require('./lib/cookieReader');
var bodyReader = require('./lib/bodyReader');
var GameSetup = require('./lib/gameSetup');
var Game = require('./lib/game');
var Pack = require('./lib/Pack');
var Player = require('./lib/player');
var setup = new GameSetup();
var game;

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};
var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
};

var redirectTo = function(res,url){
	res.writeHead(302,{'Location':url});
	res.end();
};

var playerLogin = function(req, res){
	var name = req.Body.userName;
	// if(!setup){
	// 	res.end('No spots available');
	// 	return;
	// }
	res.setHeader("Set-Cookie", ["userName="+name]);
	// setup.join(name);
	// if(setup.isReady()){
	// 	var players = setup.listPlayers().map(function(name){return new Player(name)});
	// 	game = new Game(players);
	// 	game.deal(new Pack());
	// 	setup = undefined;
	// }
	redirectTo(res,'games.html');	
};
var getGameList = function(req,res){
	return [];
};
var getGameSetupStatus = function(req,res){
	res.setHeader('Content-type','application/javascript');
	var result = {};
	if(setup){
		result.ready = false;
		result.players = setup.listPlayers();
	}else result.ready = true;
	
	res.end(JSON.stringify(result));
};

var getGameStatus = function(req,res){
	res.end(JSON.stringify(game.getStatus(req.User.name)));
};

var playerLogout = function(req, res){
	// if(req.User && setup)
	// 	setup.leave(req.User.name);
	res.setHeader("Set-Cookie", '');
	redirectTo(res,'login.html');	
};

var serveIndex = function(req, res){
	if(req.User)
		redirectTo(res,'games.html');
	else
		redirectTo(res,'login.html');
};
//TODO: name should not be empty
var ensureLoggedIn = function(req,res,next){
	if(req.User)
			next();
	else
		redirectTo(res,'login.html');
};

var ensureGameOn = function(req, res, next){
	if(game)
		next();
	else
		redirectTo(res,'waiting.html');
};

var serveStaticFile = function(req, res, next){
	var filePath = './public' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			res.statusCode = 200;
			console.log(res.statusCode);
			res.end(data);
		}
		else{
			next();
		}
	});
};

var loadUser = function(req,res,next){
	var name = req.Cookies.userName;
	var user = {name:name};
	req.User = name && user;
	//(setup && setup.exists(name) )||( game && game.exists(name)) && user;
	next();
};

exports.post_handlers = [
	{path: '', handler: cookieReader.read},
	{path: '', handler: loadUser},
	{path: '', handler: bodyReader.read},
	{path: '^/login$', handler: playerLogin},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [
	{path: '', handler: cookieReader.read},
	{path: '', handler: loadUser},
	{path: '^/$', handler: serveIndex},
	{path: '^/logout$', handler: playerLogout},
	{path: '^/waiting.html$', handler: ensureLoggedIn},
	{path: '^/game.html$', handler: ensureLoggedIn},
	{path: '^/games.html$', handler: ensureLoggedIn},
	{path: '^/gameList$', handler: ensureLoggedIn},
	{path: '^/gameList$', handler: getGameList},
	{path: '^/game.html$', handler: ensureGameOn},
	{path: '^/gameSetupStatus$', handler: getGameSetupStatus},
	{path: '^/gameStatus$', handler: ensureLoggedIn},
	{path: '^/gameStatus$', handler: ensureGameOn},
	{path: '^/gameStatus$', handler: getGameStatus},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];
