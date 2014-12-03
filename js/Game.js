var Game = function () {
	console.log("Created Game");
};

Game.prototype.tick = function() {
	console.log("TICK");
	
	this.battlefield.faction1.getMove(function() {
		var thisResult = this.battlefield.faction1.lastResult;
		var otherResult = this.battlefield.faction2.lastResult;
		if (otherResult && otherResult != "timeout") {
			this.battlefield.faction1Orders = thisResult;
			this.battlefield.faction2Orders = otherResult;			
			this.battlefield.executeOrders();
			this.battlefield.clearOrders();
		}
	});
	
	this.battlefield.faction2.getMove(function(data) {
		var thisResult = this.battlefield.faction2.lastResult;
		var otherResult = this.battlefield.faction1lastResult;
		if (otherResult && otherResult != "timeout") {
			this.battlefield.faction1Orders = otherResult;
			this.battlefield.faction2Orders = thisResult;			
			this.battlefield.executeOrders();
			this.battlefield.clearOrders();
		}
	});	
	
};

Game.prototype.init = function(faction1, faction2) {
	this.battlefield = new Battlefield(faction1, faction2);
	this.battlefield.setupTeam();
	this.battlefield.generateBattlefield();

	var moveCount = 1;
	
	function timer() {
		rerender = true;

		$("#move").html(moveCount++);
		game.tick();
	}
	
	var tid = setInterval(timer, 1000);
};