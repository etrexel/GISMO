var Game = function () {
	console.log("Created Game");
};

Game.prototype.tick = function() {
	console.log("TICK");

	console.log(this.battlefield.faction1.getMove());

	var tempTank = this.battlefield.faction1Tanks[0];
	
	board[tempTank.getLocation().getX()][tempTank.getLocation().getY()].clearUnit();
	tempTank.setSpeed(1);
	tempTank.move("S");
	board[tempTank.getLocation().getX()][tempTank.getLocation().getY()].setUnit(tempTank);
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