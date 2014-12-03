var Game = function () {
	console.log("Created Game");
};

Game.prototype.tick = function() {
	console.log("TICK");
};

Game.prototype.init = function(faction1, faction2) {
	this.battlefield = new Battlefield(faction1, faction2);
	this.battlefield.setupTeam();
	this.battlefield.generateBattlefield();
};