var fs = require('fs');
var querystring = require('querystring');
var ld = require('lodash');
var cookieReader = require('./lib/cookieReader');
var bodyReader = require('./lib/bodyReader');
var GameSetup = require('./lib/gameSetup');
var Game = require('./lib/game');
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
	if(!setup){
		res.end('No spots available');
		return;
	}
	console.log('body',req.Body);
	res.setHeader("Set-Cookie", ["userName="+name]);
	setup.join(name);
	if(setup.isReady()){
		var players = setup.listPlayers().map(function(name){return new Player(name)});
		game = new Game(players);
		setup = undefined;
	}
	redirectTo(res,'waiting.html');	
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
var playerLogout = function(req, res){
	if(req.User)
		setup.leave(req.User.name);
	redirectTo(res,'login.html');	
};

var serveIndex = function(req, res){
	if(req.User)
		redirectTo(res,'game.html');
	else
		redirectTo(res,'login.html');
};

var ensureLoggedIn = function(req,res,next){
	if(req.User)
		next();
	else
		redirectTo(res,'login.html');
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
	req.User = (setup && setup.exists(name) )||( game && game.exists(name)) && user;
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
	{path: '^/game.html$', handler: ensureLoggedIn},
	{path: '^/gameSetupStatus$', handler: getGameSetupStatus},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];
