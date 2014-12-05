var Battlefield = function (first_faction, second_faction) {
	this.battlefield = [];
	this.faction1 = first_faction;
	this.faction2 = second_faction;
	this.faction1Base = "";
	this.faction2Base = "";
	this.faction1Tanks = [];
	this.faction2Tanks = [];
	this.faction1Blockhouse;
	this.faction2Blockhouse;
	this.changedSpeed = [];
	this.changedDirection = [];
	this.faction1Orders = "";
	this.faction2Orders = "";
	this.faction1Reports = "";
	this.faction2Reports = "";
	this.boardSize = 250;
	
	this.status = "playing";
};

Battlefield.prototype.generateBattlefield = function () {
	var boardSize = this.boardSize;

	this.battlefield = Array(boardSize);
	for(y = 0 ; y < boardSize ; y++ ) {
		this.battlefield[y] = Array(boardSize);
		for(x = 0 ; x < boardSize ; x++ ) {
			if(x > 2 && y > 2){
				var rand = Math.floor(Math.random() * 1000);

				

				if(rand === 0 || rand === 1){
					this.battlefield[y][x] =  new Tile(new Terrain(1));
					this.battlefield[y - Math.floor(Math.random() * 10) % 2 ][x - Math.floor(Math.random() * 10) % 2 ] = new Tile(new Terrain(1));
				} else if(rand === 2) {
					this.battlefield[y][x] =  new Tile(new Terrain(2));
					this.battlefield[y - Math.floor(Math.random() * 10) % 2 ][x - Math.floor(Math.random() * 10) % 2 ] = new Tile(new Terrain(2));
				} else if(rand === 3) {
					this.battlefield[y][x] =  new Tile(new Terrain(3));
					this.battlefield[y - Math.floor(Math.random() * 10) % 2 ][x - Math.floor(Math.random() * 10) % 2 ] = new Tile(new Terrain(3));
				} else {
					this.battlefield[y][x] =  new Tile(new Terrain(0));
					this.battlefield[y - Math.floor(Math.random() * 10) % 2 ][x - Math.floor(Math.random() * 10) % 2 ] = new Tile(new Terrain(0));
				}
			} else {
				this.battlefield[y][x] =  new Tile(new Terrain(0));
			}
		}
	}

	for(i = 0; i < 2; i++){
		for(y = 2; y < boardSize - 2; y ++){
			for(x = 2; x < boardSize - 2; x++){
				if(this.battlefield[x][y].getTerrain().getType() != 0){
					this.battlefield[x - Math.floor(Math.random() * 10) % 2 ][y - Math.floor(Math.random() * 10) % 2 ] = new Tile(new Terrain(this.battlefield[x][y].getTerrain().getType()));
					this.battlefield[x][y - Math.floor(Math.random() * 10) % 2 ] = new Tile(new Terrain(this.battlefield[x][y].getTerrain().getType()));
					this.battlefield[x + Math.floor(Math.random() * 10) % 2 ][y] = new Tile(new Terrain(this.battlefield[x][y].getTerrain().getType()));
					this.battlefield[x][y + Math.floor(Math.random() * 10) % 2 ] = new Tile(new Terrain(this.battlefield[x][y].getTerrain().getType()));
				}
			}
		}
	}


	for(y = 0; y < 40; y++ ) {
		for(x = 0; x < 40; x++ ) {
			this.battlefield[x][y] = new Tile(new Terrain(0));
		}
	}

	for(y = 0; y < 40; y++ ) {
		for(x = 0; x < 40; x++ ) {
			this.battlefield[boardSize - x - 1][boardSize - y - 1] = new Tile(new Terrain(0));
		}
	}

	var blockhouse1Tile = new Tile(new Terrain(0))
	var blockhouse1Location = new Location(5, 5);
	var blockhouse1 = new Blockhouse(this.faction1, blockhouse1Location);
	blockhouse1Tile.setUnit(blockhouse1);
	
	this.faction1Blockhouse = blockhouse1;

	var blockhouse2Tile = new Tile(new Terrain(0))
	var blockhouse2Location = new Location(boardSize - 5 - 1, boardSize - 5 - 1);
	var blockhouse2 = new Blockhouse(this.faction2, blockhouse2Location);
	blockhouse2Tile.setUnit(blockhouse2);
	
	this.faction2Blockhouse = blockhouse2;
	
	this.battlefield[5][5] = blockhouse1Tile;
	this.battlefield[boardSize - 5 - 1][boardSize - 5 - 1] = blockhouse2Tile;
	
	// smoke test
	//this.battlefield[0][7].setSmoke(true);

	//populate tanks
	for(var i = 0; i < this.faction1Tanks.length; i++) {
		this.battlefield[this.faction1Tanks[i].location.y][this.faction1Tanks[i].location.x].setUnit(this.faction1Tanks[i]);
	}

	for(var i = 0; i < this.faction2Tanks.length; i++) {
		var x = this.faction2Tanks[i].location.x;
		var y = this.faction2Tanks[i].location.y;
		this.battlefield[y][x].setUnit(this.faction2Tanks[i]);
	}
};

Battlefield.prototype.setupTeam = function () {
	var obj = JSON.parse(this.faction1.getStart());
	var newx = 0;
	var newy = 0;

	for(var i = 0; i < obj.Tanks.length; i++) {
		var y = obj.Tanks[i].y;
		var x = obj.Tanks[i].x
		var heading = obj.Tanks[i].heading;
		var turret = obj.Tanks[i].turret;
		if (turret.length == 0)
			turret = "N";
		
		if(x > 30) {
			x = newx++;
		}
		if(y > 30) {
			y = newy++;
		}
		var tankLoc = new Location(x,y);
		var tank = new Tank(this.faction1,tankLoc, heading, turret);
		this.faction1Tanks.push(tank);
	}

	var obj = JSON.parse(this.faction2.getStart());

	var newx = this.boardSize - 2;
	var newy = this.boardSize - 1;

	for(var i = 0; i < obj.Tanks.length; i++) {
		var y = obj.Tanks[i].y;
		var x = obj.Tanks[i].x
		var heading = obj.Tanks[i].heading;
		var turret = obj.Tanks[i].turret;
		if (turret.length == 0)
			turret = "N";
		
		if(x < this.boardSize - 30) {
			x = newx--;
		}
		if(y < this.boardSize - 30) {
			y = newy--;
		}
		var tankLoc = new Location(x,y);
		var tank = new Tank(this.faction2, tankLoc, heading, turret);
		this.faction2Tanks.push(tank);
	}
};

Battlefield.prototype.tankReport = function (faction) {

};

Battlefield.prototype.inScope = function(x1, y1, x2, y2, scope) {
	var dx = x2 - x1;
	var dy = y2 - y1;

	var inView = false;
	for (var wedge in scope) {
		if (inView)
			break;
		switch (wedge) {
			case "N":
			if (dy >= -2*dx && dy >= 2*dx) inView = true;
			break;
			case "NE":
			if (dy <= 2*dx && 2*dy >= dx) inView = true;
			break;
			case "E":
			if (2*dy <= dx && 2*dy >= -dx) inView = true;
			break;
			case "SE":
			if (2*dy <= -dx && dy >= -2*dx) inView = true;
			break;
			case "S":
			if (dy <= -2*dx && dy <= 2*dx) inView = true;
			break;
			case "SW":
			if (2*dy <= dx && dy >= 2*dx) inView = true;
			break;
			case "W":
			if (2*dy >= dx && 2*dy <= -dx) inView = true;
			break;
			case "NW":
			if (2*dy >= -dx && dy <= -2*dx) inView = true;
			break;
		}
	}

	return inView;
}

Battlefield.prototype.inLineOfSight = function(x1, y1, x2, y2, scope) {
	// check if the object is in one of the wedges of visibility
	// algorithm from GISMO document
	var dx = x2 - x1;
	var dy = y2 - y1;

	var inView = this.inScope(x1, y1, x2, y2, scope);

	if (inView) {
		// check if the object is actualy visible (not blocked)
		// algorithm from GISMO document
		var absDx = Math.abs(dx);
		var absDy = Math.abs(dy);
		var blocked = false;
		if (absDx >= absDy) {
			// x dist magnitude greater than y dist magnitude
			var x = 1;
			var y = 0;
			while (x < absDx && !blocked) {
				if ((y+1)*absDx <= x*absDy + Math.floor(dx / 2))
					y++;
				var xOffset = dx >= 0 ? x : -x;
				var yOffset = dy >= 0 ? y : -y;
				var tile = this.battlefield[y1+yOffset][x1+xOffset];
				if (!tile.getTerrain().canSee())
					blocked = true;
				x++;
			}					

		} else {
			// y dist magnitude greater than x dist magnitude				
			var y = 1;
			var x = 0;
			var blocked = false;
			while (y < absDy && !blocked) {
				if ((x+1)*absDy <= y*absDx + Math.floor(dy / 2))
					x++;
				var xOffset = dx >= 0 ? x : -x;
				var yOffset = dy >= 0 ? y : -y;
				var tile = this.battlefield[y1+yOffset][x1+xOffset];
				if (!tile.getTerrain().canSee())
					blocked = true;
				y++;
			}
			
		}
		
		return !blocked;
	}
	
	return false;
}

Battlefield.prototype.objectReport = function (faction) { 
	// currently using simplified visibility rules:
	// 1. tanks do not block line of sight
	// 2. smoke cannot be seen through forest
	// 3. tanks on the edge of a forest are never seen even if moving

	var tanks;
	var enemyTanks;
	if (faction == this.faction1) {
		tanks = this.faction1Tanks;
		enemyTanks = this.faction2Tanks;
	} else if (faction == this.faction2) {
		tanks = this.faction2Tanks;
		enemyTanks = this.faction1Tanks;
	}
	
	var dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
	
	var objects = [];
	
	for (var y = 0; y < this.battlefield.length; y++) {
		for (var x = 0; x < this.battlefield[0].length; x++) {
			var tile = this.battlefield[y][x];
			if (tile.getUnit() || tile.hasSmoke())
				objects.push({
					"x": x,
					"y": y,
					"tile": tile				
				});
		}
	}	
	
	var visibleObjects = {};
	

	for(var i = 0; i < tanks.length; i++) {
		var tankX = tanks[i].location.getX();
		var tankY = tanks[i].location.getY();
		var facing = tanks[i].getHeading();
		var turret = tanks[i].getHeading();
		
		var scope = [];
		scope.push(dirs[(dirs.indexOf(turret)+7)%8]); // the wedge one counter-clockwise of the turret
		scope.push(turret); // the wedge the turret is facing
		scope.push(dirs[(dirs.indexOf(turret)+1)%8]); // the wedge one clockwise of the turret
		if (scope.indexOf(facing) == -1)
			turret.push(facing); // the wedge the tank is facing

		for( var j = 0; j < objects.length; j++ ) {
			// each obj represents a tile which can have both smoke and a unit
			// determine if location itself is visible

			var objX = objects[j]["x"];
			var objY = objects[j]["y"];
			var tile = objects[j]["tile"];
			
			// can a tank see smoke on itself? does it need to?
			if (tile.getUnit() === tanks[i])
				continue; // the object is itself, skip
			
			var blocked = this.inLineOfSight(tankX, tankY, objX, objY, scope);
			
			if (!blocked) {
				if (!visibleObjects[objects[j]])
					visibleObjects[objects[j]] = [];
				visibleObjects[objects[j]].push(tanks[i]);
			}
		}
		console.log(scope);
	}
	
	var objectReportObjects = [];
	for (var i = 0; i < visibleObjects.length; i ++ ) {
		var x = visibleObjects[i]["x"];
		var y = visibleObjects[i]["y"];
		var seenBy = visibleObjects[visibleObjects[i]];
		var seenByIndeces = [];
		for (var tank in seenBy) {
			seenByIndeces.push[tanks.indexOf(tanks[i])];
		}
		if (visibleObjects[i]["tile"].hasSmoke()) {
			// add to report => smoke at (x,y) seen by seenBy
			var newObject = {
				"type": "Smoke",
				"x": x,
				"y": y,
				"seenBy": seenByIndeces
			};			
			objectReportObjects.push(newObject);
		}
		var unit = visibleObjects[i]["tile"].getUnit();
		if (unit) {
			var newObject = {
				"type": unit.getType(),
				"x": x,
				"y": y,
				"seenBy": seenByIndeces,
			};
			
			if (unit.getType() == "Tank") {
				newObject["flags"] = {
					"Mobile": unit.canMove(),
					"Weapon": unit.canFire()
				};
				newObject["hits"] = 2-unit.health;
				newObject["heading"] = unit.getHeading();
				newObject["turretFacing"] = unit.getTurret();
				newObject["speed"] = unit.getSpeed();
			} else if (unit.getType() == "Blockhouse") {
				newObject["hits"] = 3-unit.health;
			}
			
			objectReportObjects.push(newObject);
		}			
	} 
	
	return objectReportObjects;
};

Battlefield.prototype.generateReports = function () {
	var tankReport = this.tankReport(this.faction1);
	var objectReport = this.objectReport(this.faction1);
	this.faction1Reports = tankReport + objectReport;
	tankReport = this.tankReport(this.faction2);
	objectReport = this.objectReport(this.faction2);
	this.faction2Reports = tankReport + objectReport;
};

Battlefield.prototype.getTileInDirection = function(x, y, dir, flip) {
	var xOffset = 0;
	var yOffset = 0;
	
	if (dir.search("E") == 1)
		xOffset = 1;
	else if (dir.search("W") == 1)
		xOffset = -1;
	
	if (dir.search("N") == 1)
		yOffset = -1;
	else if (dir.search("S") == 1)
		yOffset = 1;
		
	if (flip) {
		xOffset = -xOffset;
		yOffset = -yOffset;
	}	
		
	return this.battlefield[y+yOffset][x+xOffset];	
}

Battlefield.prototype.executeOrders = function () {
	var orders1 = JSON.parse(this.faction1Orders);
	var orders2 = JSON.parse(this.faction2Orders);

	/*
	// check for surrender
	if (orders1["surrender"] && orders1["surrender"]) {
		this.status = "Draw (both surrendered)";
		return;
	} else if (orders1["surrender"]) {
		this.status = this.faction2 + " wins (opponent surrendered)";
		return;
	} else if (orders2["surrender"]) {
		this.status = this.faction1 + " wins (opponent surrendered)";
		return;
	}	
	*/
	
	// put all orders into one array for easy traversal
	var tanksAndOrders = [];
	for (var i=0; i<this.faction1Tanks.length; i++) {
		var tankLoc = this.faction1Tanks[i].getLocation();
		tanksAndOrders.push({
			"faction": 1,
			"tank": this.faction1Tanks[i],
			"orders": orders1["Tanks"][i],
			"oldLocation": new Location(tankLoc.getX(), tankLoc.getY())
		});
	}
	for (var i=0; i<this.faction2Tanks.length; i++) {
		var tankLoc = this.faction2Tanks[i].getLocation();
		tanksAndOrders.push({
			"faction": 2,
			"tank": this.faction2Tanks[i],
			"orders": orders2["Tanks"][i],
			"oldLocation": new Location(tankLoc.getX(), tankLoc.getY())
		});
	}
	
	// fire
	/*
	for (var i=0; i<tanksAndOrders.length; i++) {

		var orders = tanksAndOrders[i]["orders"];
		if (!orders)
			continue; // no orders given for this tank
		
		var tank = tanksAndOrders[i]["tank"];

		var x = orders["X"];
		var y = orders["Y"];
		if (x && y) {
			var targetTile = this.battlefield[y][x];
			var target = targetTile.getUnit();
			if (target
				&& tank.gunReady()
				&& tank.canFire() 
				&& this.inScope(tank.getLocation().getX(), tank.getLocation().getY(), x, y, [tank.getTurret()])) {
				
				tank.fire();
				tank.reload();

				var turretSmokeTile = this.getTileInDirection(tank.getLocation().getX(), tank.getLocation().getY(), tank.getTurret());				
				turretSmokeTile.setSmoke(true);

				var damage;
				if (!this.inLineOfSight(tank.getLocation().getX(), tank.getLocation().getY(), x, y, [tank.getTurret()]))
					damage = 0;
				else
					damage = this.toHit(tank, target);

				if (damage > 0) {
					if (target.getType() == "Blockhouse") 
						target.hit(1);
					else if (target.getType() == "Tank") 
						target.hit(damage);		

					var hitSmokeTile = this.getTileInDirection(x, y, tank.getTurret(), true);
					hitSmokeTile.setSmoke(true);
				}				
			}
		}
		
	}
	*/

	// all tanks have fired, check blockhouse status
	/*
	var blockhouse1Health = this.faction1Blockhouse.getHealth();
	var blockhouse2Health = this.faction2Blockhouse.getHealth();
	
	if (blockhouse1Health == 0 && blockhouse2Health == 0) {
		this.status = "Draw (both blockhouses destroyed)";
		return;
	} else if (blockhouse1Health == 0) {
		this.status = this.faction2 + " wins (opponent blockhouse destroyed)";
		return;
	} else if (blockhouse2Health == 0) {
		this.status = this.faction1 + " wins (opponent blockhouse destroyed)";
		return;
	}
	
	// check tank status
	var faction1Alive = false;
	var faction2Alive = false;
	for (var i = 0; i < this.faction1Tanks.length; i++ ) {
		if (!this.faction1Tanks[i].isDestroyed()) {
			faction1Alive = true
			break;
		}
	}
	for (var i = 0; i < this.faction2Tanks.length; i++ ) {
		if (!this.faction2Tanks[i].isDestroyed()) {
			faction2Alive = true
			break;
		}
	}
	
	if (!faction1Alive && !faction2Alive) {
		this.status = "Draw (all tanks destroyed)";
		return;
	} else if (!faction1Alive) {
		this.status = this.faction2 + " wins (opponent tanks destroyed)";
		return;
	} else if (!faction2Alive) {
		this.status = this.faction1 + " wins (opponent tanks destroyed)";
		return;
	}
	*/

	// change speed
	
	for (var i=0; i<tanksAndOrders.length; i++) {
		var orders = tanksAndOrders[i]["orders"];		
		var tank = tanksAndOrders[i]["tank"];
		
		tank.setSpeed(orders["speed"]);
		
		var tile = this.battlefield[tank.getLocation().getY()][tank.getLocation().getX()]
		
		// forest check
		if (tile.getTerrain().slows()) {
			if (tank.getSpeed() == 2)
				tank.setSpeed(1);
		}			
	}
	
	
	// move (start)
	// currently using simplified logic: tanks moving at speed 2 essentially skip 1 space without actually traveling through it
	// this means tanks can sometimes move through other tanks or through single mountain and water tiles
	// tanks can also move through each other as long as they dont ever stop on the same tile
	
		
	// move all tanks without checking for collisions
	for (var i=0; i<tanksAndOrders.length; i++) {

		var orders = tanksAndOrders[i]["orders"];
		if (!orders)
			continue; // no orders given for this tank
		
		var tank = tanksAndOrders[i]["tank"];
		
		tank.move(orders["heading"]);
	}
	
	
	//check for collisions with terrain/blockhouses or edge of board, undo move if necessary (retaining new heading)
	for (var i=0; i<tanksAndOrders.length; i++) {
		var tank = tanksAndOrders[i]["tank"];
		var x = tank.location.getX();
		var y = tank.location.getY();
		if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize)
			tank.location = tanksAndOrders[i]["oldLocation"];
		else {		
			var tile = this.battlefield[y][x];
			
			if (!tile.getTerrain().canMove() || (tile.getUnit() && tile.getUnit().getType() == "Blockhouse")) {
				tank.location = tanksAndOrders[i]["oldLocation"];
				tank.immobilize();
			}
			
		}
	}	
	
	
	// check for collisions with tanks, undo moves if necessary (retaining new heading)
	// collision checking is restarted each time a tank collision is resolved until all collisions are resolved
	
	
	var collisionsResolved = false;
	var iterations = 0;
	while (!collisionsResolved) {
		iterations++;
		if (iterations > 30) 
			break; // uh oh
		
		collisionsResolved = true;

		for (var i=0; i<tanksAndOrders.length; i++) {
			var tank = tanksAndOrders[i]["tank"];
			
			var occupySameLoc = [tanksAndOrders[i]];
			for (var j=i+1; j<tanksAndOrders.length; j++) {
				var tank2 = tanksAndOrders[j]["tank"];
				if (tank.getLocation().isEqual(tank2.getLocation()))
					occupySameLoc.push(tanksAndOrders[j]);
			}
			
			if (occupySameLoc.length > 1) {
				for (var k=0; k<occupySameLoc.length; k++) {
					var occupant = occupySameLoc[k];
					occupant["tank"].location = occupant["oldLocation"];
					occupant["tank"].immobilize();
				}
				collisionsResolved = false;
				break; // restart collision resolution
			}
		}
	}
	
	
	
	// check if tanks ended up in water and immobilize them
	// check if tanks ended up in forest and slow them
	
	for (var i=0; i<tanksAndOrders.length; i++) {
		var tank = tanksAndOrders[i]["tank"];
		var tile = this.battlefield[tank.getLocation().getY()][tank.getLocation().getX()];
		
		// water check
		if (tile.getTerrain().immobilizes()) 
			tank.immobilize();
		
	}
	
	
	// update battlefield state with new tank locations
	for (var i=0; i<tanksAndOrders.length; i++) {
		var oldLoc = tanksAndOrders[i]["oldLocation"];
		var tile = this.battlefield[oldLoc.getY()][oldLoc.getX()];
		tile.clearUnit();
	}
	for (var i=0; i<tanksAndOrders.length; i++) {	
		var tank = tanksAndOrders[i]["tank"];
		var tile = this.battlefield[tank.getLocation().getY()][tank.getLocation().getX()];
		tile.setUnit(tank);
	}	
	 //move (end)
	
	
	

	
	// turn turret
	for (var i=0; i<tanksAndOrders.length; i++) {

		var orders = tanksAndOrders[i]["orders"];
		if (!orders)
			continue; // no orders given for this tank
		
		var tank = tanksAndOrders[i]["tank"];
		
		tank.setTurret(orders["TurretFacing"]);
	}
	
	
};

Battlefield.prototype.clearOrders = function () {
	this.faction1Orders = "";
	this.faction2Orders = "";
};

Battlefield.prototype.clearSmoke = function () {
	for (var y=0; y<this.battlefield.length; y++) {
		for (var x=0; x<this.battlefield[0].length; x++) {
			this.battlefield[y][x].setSmoke(false);
		}
	}
};

Battlefield.prototype.checkVictory = function () {
	if (this.status == "playing")
		return null;
	else
		return this.status;
};

Battlefield.prototype.sendReports = function () {

};

Battlefield.prototype.tick = function () {
	this.clearSmoke();
	this.executeOrders();
	this.clearOrders();
	var victory = this.checkVictory();
	if (victory !== null) {
		return victory;
	}
	this.generateReports();
	this.sendReports();
	return null;
};

Battlefield.prototype.toHit = function (attacker, defender) {
	var Dx = defender.getLocation().getX() - attacker.getLocation.getX();
	var Dy = defender.getLocation().getY() - attacker.getLocation.getY();
	var D = Dx*Dx + Dy*Dy;
	var probability;
	if (D > 100) {
		return 0;
	} else {
		probability = Math.round(100 * Math.exp(-0.0003 * D) - 5);

		switch (attacker.getSpeed()) {
			case -1:
			case 1:
			probability = probability - 3;
			break;
			case 2:
			probability = probability - 5;
			break;
			case 0:
			break;
			default:
			break;
		}

		switch (defender.getSpeed()) {
			case -1:
			case 1:
			probability = probability - 5;
			break;
			case 2:
			probability = probability - 10;
			break;
			case 0:
			break;
			default:
			break;
		}

		if (this.changedSpeed.contains(attacker)) {
			probability = probability - 5;
		}
		if (this.changedDirection.contains(attacker)) {
			probability = probability - 5;
		}
		if (this.changedSpeed.contains(defender)) {
			probability = probability - 5;
		}
		if (this.changedDirection.contains(defender)) {
			probability = probability - 5;
		}

        //TODO Add Direction of Impact
        if (defender.getType() === "Tank") {
        	console.log("Add Direction of Impact");
        }

        if (probability < 0) {
        	probability = 0;
        }
        if (probability > 95) {
        	probability = 95;
        }

        var rand = Math.random() % 101;
        if (rand <= probability) {
        	if (D >= 50) {
        		return 1;
        	} else {
        		return 2;
        	}
        }
    }
};