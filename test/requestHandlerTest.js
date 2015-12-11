var assert = require('chai').assert;
var request = require('supertest');
var handler = require('../requestHandler');
var games = require('../routes').games;
describe('requestHandler',function(){
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
				.expect('Location','game.html')
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
	})
});