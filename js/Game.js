var Game = function () {
	console.log("Created Game");
};

Game.prototype.tick = function() {
	console.log("TICK");

	rerender = true;

	this.battlefield.faction1Orders = this.battlefield.faction1.getMove();
	this.battlefield.faction2Orders = this.battlefield.faction2.getMove();

	this.battlefield.executeOrders();
	this.battlefield.clearOrders();

	
	
};

Game.prototype.init = function(faction1, faction2) {
	this.battlefield = new Battlefield(faction1, faction2);
	this.battlefield.setupTeam();
	this.battlefield.generateBattlefield();

	var moveCount = 1;
	
	var tid = setTimeout(timer, 1000);
	function timer() {
		rerender = true;

		$("#move").html(moveCount++);
		game.tick();
		tid = setTimeout(timer, 1000);
	}
};