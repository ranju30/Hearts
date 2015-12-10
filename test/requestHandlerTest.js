var assert = require('chai').assert;
var request = require('supertest');
var handler = require('../requestHandler');
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
				.expect('Location','games.html',done);
		})
	}),
	describe('login',function(){
		it('should set cookies when user sends userName',function(done){
			request(handler)
				.post('/login')
				.send('userName=John')
				.expect(302)
				.expect('Location','games.html')
				.expect('Set-Cookie','userName=John',done)
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
	describe('games.html',function(){
		it('should redirect to login if not logged in',function(done){
			request(handler)
				.get('/games.html')
				.expect(302)
				.expect('Location','login.html',done);
		}),
		it('should give games.html if logged in',function(done){
			request(handler)
				.get('/games.html')
				.set('Cookie',['userName=John'])
				.expect(200)
				.expect(/<title>Games<\/title>/,done);
		})	
	})
});