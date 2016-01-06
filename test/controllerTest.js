var assert = require('chai').assert;
var request = require('supertest');
var handler = require('../lib/controller');
var games = handler.games;
describe('controller',function(){
	describe('/',function(){
		it('should redirect to login when not yet logged in',function(done){
			request(handler)
				.get('/')
				.expect(302)
				.expect('Location','login.html',done);
		}),
		it('should redirect to games when logged in',function(done){
			request(handler)
				.get('/')
				.set('Cookie',['userName=John'])
				.expect(302)
				.expect('Location','game.html',done);
		})
	}),
	describe('login',function(){
		it('should join set cookies when user sends userName',function(done){
			request(handler)
				.post('/login')
				.send('userName=John')
				.expect(302)
				.expect('Location','game.html',done)
				.expect('Set-Cookie','userName=John',done)
		}),
		describe('when no games are active',function(){
			it('should start a new game & join it',function(){
				request(handler)
					.post('/login')
					.send('userName=John')
					.expect(302)
				assert.equal(1,games.count());
				assert.ok(games.findByPlayer('John'));
			})
		})
	}),
	describe('logout',function(){
		it('should reset cookies and redirect to login.html',function(done){
			request(handler)
				.get('/logout')
				.expect(302)
				.expect('Location','login.html')
				.expect('Set-Cookie','',done)
		})
	}),
	describe('game.html',function(){
		it('should redirect to login.html if player is not logged in',function(done){
			request(handler)
				.get('/game.html')
				.expect(302)
				.expect('Location','login.html',done);

		})
		it('should take player to game page if logged in',function(done){
			request(handler)
				.get('/game.html')
				.set('Cookie', ['userName=Jack'])
				.expect(/Hearts/)
				.expect(200,done)
		})
	}),
	describe('gameStatus.html',function(){
		it('should redirect to login.html if player is not logged in',function(done){
			request(handler)
				.get('/gameStatus')
				.expect(302)
				.expect('Location','login.html',done);
		})
		it('should take player to game page if logged in',function(done){
			request(handler)
				.get('/gameStatus')
				.set('Cookie', ['userName=Jack'])
				.expect(200)
				.expect(/Waiting for/,done)
		})
		it('should show status if 4 players have joined',function(done){
			request(handler)
				.post('/login')
				.send('userName=John')
				.end(function(){
					request(handler)
						.post('/login')
						.send('userName=Jill')
						.end(function(){
							request(handler)
								.post('/login')
								.send('userName=neil')
								.end(function(){
									request(handler)
										.post('/login')
										.send('userName=Johnie')
										.end(function(){
											request(handler)
												.post('/gameStatus')
												.set('cookie',['userName=Jill'])
												.expect(/turn/)
												.expect(200,done)
										})
								})
						})
				})
		})
	});
	describe('startGame',function(){
		it('should start the gameby playing club-2',function(done){
			request(handler)
				.post('/login')
				.send('userName=John')
				.end(function(){
					request(handler)
						.post('/login')
						.send('userName=Jill')
						.end(function(){
							request(handler)
								.post('/login')
								.send('userName=neil')
								.end(function(){
									request(handler)
										.post('/login')
										.send('userName=Johnie')
										.end(function(){
											request(handler)
												.post('/startGame')
												.set('cookie',['userName=Jill'])
												.expect(200,done)
										})
								})
						})
				})
		});
	});
});