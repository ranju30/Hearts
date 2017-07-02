var assert = require("chai").assert;
var request = require("supertest");
var handler = require("../lib/controller");
var games = handler.games;
describe("controller",function(){
	describe("/",function(){
		it("should redirect to login when not yet logged in",function(done){
			request(handler)
				.get("/")
				.expect(302)
				.expect("Location","login.html",done);
		}),
		it("should redirect to games when logged in",function(done){
			request(handler)
				.get("/")
				.set("Cookie",["userName=John"])
				.expect(302)
				.expect("Location","gamePage.html",done);
		});
	}),
	describe("login",function(){
		it("should join set cookies when user sends userName",function(done){
			request(handler)
				.post("/login")
				.send("userName=John")
				.expect("set-cookie","userName=John; Path=/")
				.expect(302)
				.expect("Location","gamePage.html",done);
		}),
		describe("when no games are active",function(){
			it("should start a new game & join it",function(){
				request(handler)
					.post("/login")
					.send("userName=John")
					.expect(302)
					.expect("Location","game.html");
				assert.equal(1,games.count());
				assert.ok(games.findByPlayer("John"));
			});
		});
	}),
	describe("logout",function(){
		it("should reset cookies and redirect to login.html",function(done){
			request(handler)
				.get("/logout")
				.expect(302)
				.expect("Location","login.html")
				.expect("set-cookie","userName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",done);
		});
	}),
	describe("gamePage.html",function(){
		it("should redirect to login.html if player is not logged in",function(done){
			request(handler)
				.get("/gamePage.html")
				.expect(302)
				.expect("Location","login.html",done);

		});
		it("should take player to game page if logged in",function(done){
			request(handler)
				.get("/gamePage.html")
				.set("Cookie", ["userName=Jack"])
				.expect(/gamePage/)
				.expect(200,done);
		});
	}),
	describe("gameStatus.html",function(){
		it("should redirect to login.html if player is not logged in",function(done){
			request(handler)
				.get("/gameStatus")
				.expect(302)
				.expect("Location","login.html",done);
		});
		it("should take player to game page if logged in",function(done){
			request(handler)
				.get("/gameStatus")
				.set("Cookie", ["userName=Jack"])
				.expect(200)
				.expect(/Waiting for/,done);
		});
		it("should show status if 4 players have joined",function(done){
			request(handler)
				.post("/login")
				.send("userName=John")
				.end(function(){
					request(handler)
						.post("/login")
						.send("userName=Jill")
						.end(function(){
							request(handler)
								.post("/login")
								.send("userName=neil")
								.end(function(){
									request(handler)
										.post("/login")
										.send("userName=Johnie")
										.end(function(){
											request(handler)
												.post("/gameStatus")
												.set("cookie",["userName=Jill"])
												.expect(/"Select 3 Cards and pass to neil"/)
												.expect(200,done);
										});
								});
						});
				});
		});
	});
	describe("startGame",function(){
		it("should start the gameby playing club-2",function(done){
			request(handler)
				.post("/login")
				.send("userName=John")
				.end(function(){
					request(handler)
						.post("/login")
						.send("userName=Jill")
						.end(function(){
							request(handler)
								.post("/login")
								.send("userName=neil")
								.end(function(){
									request(handler)
										.post("/login")
										.send("userName=Johnie")
										.end(function(){
											request(handler)
												.post("/startGame")
												.set("cookie",["userName=Jill"])
												.expect(200,done);
										});
								});
						});
				});
		});
	});
	describe("startGame",function(){
		it("should start the gameby playing club-2",function(done){
			request(handler)
				.post("/login")
				.send("userName=John")
				.end(function(){
					request(handler)
						.post("/login")
						.send("userName=Jill")
						.end(function(){
							request(handler)
								.post("/login")
								.send("userName=neil")
								.end(function(){
									request(handler)
										.post("/login")
										.send("userName=Johnie")
										.end(function(){
											request(handler)
												.get("/boardStatus")
												.set("cookie",["userName=Jill"])
												.expect([])
												.expect(200,done);
										});
								});
						});
				});
		});
	});
	describe("getGameOver",function(){
		it("give the winner name if game is over",function(done){
			request(handler)
				.post("/login")
				.send("userName=John")
				.end(function(){
					request(handler)
						.post("/login")
						.send("userName=Jill")
						.end(function(){
							request(handler)
								.post("/login")
								.send("userName=neil")
								.end(function(){
									request(handler)
										.post("/login")
										.send("userName=Johnie")
										.end(function(){
											request(handler)
												.get("/gameOver")
												.set("cookie",["userName=neil"])
												.expect("")
												.expect(200,done);
										});
								});
						});
				});

		});
	});
	describe("cardToBePassed",function(){
		it("calls player if all 4 player passed cards",function(done){
			request(handler)
				.post("/login")
				.send("userName=John")
				.end(function(){
					request(handler)
						.post("/login")
						.send("userName=Jill")
						.end(function(){
							request(handler)
								.post("/login")
								.send("userName=neil")
								.end(function(){
									request(handler)
										.post("/login")
										.send("userName=Johnie")
										.end(function(){
											request(handler)
												.post("/selectCardToPass")
												.expect(302,done);
										});
								});
						});
				});

		});
	});
});