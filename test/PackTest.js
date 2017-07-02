var _ = require("lodash");
var assert = require("chai").assert;
var Pack = require("../lib/pack");

describe("Pack",function(){
	describe("isNotEmpty",function(){
		it("at start",function(){
			var pack = new Pack();
			assert.ok(pack.isNotEmpty());
		}),
		it("fails, after 52 cards are drawn out",function(){
			var pack = new Pack();
			_.times(52,function(){pack.drawOne();});
			assert.notOk(pack.isNotEmpty());
		});	
	});
	describe("drawOne",function(){
		it("gives spade ace, at first",function(){
			var pack = new Pack();
			assert.deepEqual({suit:"spade",rank:"A"},pack.drawOne().getInfo());
		}),
		it("gives no card after 52 cards are drawn",function(){
			var pack = new Pack();
			_.times(52,function(){pack.drawOne();});
			assert.equal(null,pack.drawOne());
		}),
		it("gives heart ace as the fourteenth card",function(){
			var pack = new Pack();
			_.times(13,function(){pack.drawOne();});
			assert.deepEqual({suit:"heart",rank: "A"},pack.drawOne().getInfo());
		});
	});
});