var Game = function () {
	console.log("Created Game");
};

Game.prototype.tick = function() {
	console.log("TICK");

	rerender = true;

	this.battlefield.faction1Orders = this.battlefield.faction1.getMove();
	this.battlefield.faction2Orders = this.battlefield.faction2.getMove();

	//this.battlefield.executeOrders();
	//this.battlefield.clearOrders();

	//console.log(this.battlefield.objectReport(this.battlefield.faction1));
	
	var status = this.battlefield.tick();
	
	
	$('#f1').html("<div>Team 1: </div>");
	for(var i = 0; i < this.battlefield.faction1Tanks.length; i++ ) {
		if(!this.battlefield.faction1Tanks[i].isDestroyed()) {
			$('#f1').html($('#f1').html() + "<img src='img/red_tank.png' height='10' style='margin: 2% 2% 2% 2%;'/>" );
		}
	}

	$('#f2').html("<div>Team 2: </div>");
	for(var i = 0; i < this.battlefield.faction2Tanks.length; i++ ) {
		if(!this.battlefield.faction2Tanks[i].isDestroyed()) {
			$('#f2').html($('#f2').html() + "<img src='img/blue_tank.png' height='10' style='margin: 2% 2% 2% 2%;'/>" );
		}
	}
	
	
	if (status) {
		console.log(status);
		return true
	}
};

Game.prototype.init = function(faction1, faction2) {
	this.battlefield = new Battlefield(faction1, faction2);
	this.battlefield.setupTeam();
	this.battlefield.generateBattlefield();
	
	//console.log(this.battlefield.objectReport(this.battlefield.faction1));
	//this.battlefield.faction2Blockhouse.health = 0;

	var moveCount = 1;
	
	var tid = setTimeout(timer, 1000);
	function timer() {
		rerender = true;

		$("#gen").html(moveCount++);
		var gameIsOver = game.tick();
		
		if (gameIsOver)
			return;

		tid = setTimeout(timer, 1000);
	}
};