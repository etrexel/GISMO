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


	for(y = 0; y < 10; y++ ) {
		for(x = 0; x < 10; x++ ) {
			this.battlefield[x][y] = new Tile(new Terrain(0));
		}
	}

	for(y = 0; y < 10; y++ ) {
		for(x = 0; x < 10; x++ ) {
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
	this.battlefield[0][7].setSmoke(true);

	//populate tanks
	for(var i = 0; i < this.faction1Tanks.length; i++) {
		this.battlefield[this.faction1Tanks[i].location.x][this.faction1Tanks[i].location.y].setUnit(this.faction1Tanks[i]);
	}

	for(var i = 0; i < this.faction2Tanks.length; i++) {
		var x = this.faction2Tanks[i].location.x;
		var y = this.faction2Tanks[i].location.y;
		this.battlefield[x][y].setUnit(this.faction2Tanks[i]);
	}
};

Battlefield.prototype.setupTeam = function () {
	var obj = JSON.parse(this.faction1.getStart());
	var newx = 0;
	var newy = 0;

	for(var i = 0; i < obj.Tanks.length; i++) {
		var y = obj.Tanks[i].y;
		var x = obj.Tanks[i].x
		
		if(x > 30) {
			x = newx++;
		}
		if(y > 30) {
			y = newy++;
		}
		var tankLoc = new Location(y,x);
		var tank = new Tank(this.faction1,tankLoc , "N", "N");
		this.faction1Tanks.push(tank);
	}

	var obj = JSON.parse(this.faction2.getStart());

	var newx = this.boardSize - 2;
	var newy = this.boardSize - 1;

	for(var i = 0; i < obj.Tanks.length; i++) {
		var y = obj.Tanks[i].y;
		var x = obj.Tanks[i].x
		
		if(x < this.boardSize - 30) {
			x = newx--;
		}
		if(y < this.boardSize - 30) {
			y = newy--;
		}
		var tankLoc = new Location(y,x);
		var tank = new Tank(this.faction2, tankLoc, "N", "N");
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
	if (!tanks)
		return; // invalid faction param
	
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
	
	for (var tank in tanks) {
		var tankX = tank.location.getX();
		var tankY = tank.location.getY();
		var facing = tank.getFacing();
		var turret = tank.getTurret();
		
		var scope = [];
		scope.push(dirs[(dirs.indexOf(turret)+7)%8]); // the wedge one counter-clockwise of the turret
		scope.push(turret); // the wedge the turret is facing
		scope.push(dirs[(dirs.indexOf(turret)+1)%8]); // the wedge one clockwise of the turret
		if (scope.indexOf(facing) == -1)
			turret.push(facing); // the wedge the tank is facing

		for (var obj in objects) {
			// each obj represents a tile which can have both smoke and a unit
			// determine if location itself is visible

			var objX = obj["x"];
			var objY = obj["y"];
			var tile = obj["tile"];
			
			// can a tank see smoke on itself? does it need to?
			if (tile.getUnit() === tank)
				continue; // the object is itself, skip
			
			var blocked = this.inLineOfSight(tankX, tankY, objX, objY, scope);
			
			if (!blocked) {
				if (!visibleObjects[obj])
					visibleObjects[obj] = [];
				visibleObjects[obj].push(tank);
			}
		}
	}
	
	var objectReportObjects = [];
	for (var obj in visibleObjects) {
		var x = obj["x"];
		var y = obj["y"];
		var seenBy = visibleObjects[obj];
		var seenByIndeces = [];
		for (var tank in seenBy) {
			seenByIndeces.push[tanks.indexOf(tank)];
		}
		if (obj["tile"].hasSmoke()) {
			// add to report => smoke at (x,y) seen by seenBy
			var newObject = {
				"type": "Smoke",
				"x": x,
				"y": y,
				"seenBy": seenByIndeces
			};			
			objectReportObjects.push(newObject);
		}
		var unit = obj["tile"].getUnit();
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

Battlefield.prototype.executeOrders = function () {
	var orders1 = JSON.parse(this.faction1Orders);
	var orders2 = JSON.parse(this.faction2Orders);
	
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
	
	// put all orders into one array for easy traversal
	var tanksAndOrders = [];
	for (var i=0; i<this.faction1Tanks.length; i++) {
		tanksAndOrders.push({
			"faction": 1,
			"tank": this.faction1Tanks[i],
			"orders": orders1["tanks"][i]
		});
	}
	for (var i=0; i<this.faction2Tanks.length; i++) {
		tanksAndOrders.push({
			"faction": 2,
			"tank": this.faction2Tanks[i],
			"orders": orders2["tanks"][i]
		});
	}
	
	// fire
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

			var tankTile = this.battlefield[tank.getLocation().getY()][tank.getLocation().getX()];
			tankTile.setSmoke(true);

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

				targetTile.setSmoke(true);
			}				
		}
	}
	
}

	// all tanks have fired, check blockhouse status
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
	for (var tank in this.faction1Tanks) {
		if (!tank.isDestroyed()) {
			faction1Alive = true
			break;
		}
	}
	for (var tank in this.faction2Tanks) {
		if (!tank.isDestroyed()) {
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

	// change speed
	for (var i=0; i<tanksAndOrders.length; i++) {

		var orders = tanksAndOrders[i]["orders"];
		if (!orders)
			continue; // no orders given for this tank
		
		var tank = tanksAndOrders[i]["tank"];
		
		tank.setSpeed(orders["speed"]);
	}
	
	// move (start)
	// currently using simplified logic: tanks moving at speed 2 essentially skip 1 space without actually traveling through it
	// this means tanks can sometimes move through other tanks or through single mountain and water tiles
	// tanks can also move through each other as long as they dont ever stop on the same tile
	
	var oldLocations = {};
	for (var i=0; i<tanksAndOrders.length; i++) {
		var tank = tanksAndOrders[i]["tank"];
		var loc = tank.getLocation();
		oldLocations[tank] = new Location(loc.getX(), loc.getY()); // using tank objects as dictionary keys, sneaky
	}	
	
	// move all tanks without checking for collisions
	for (var i=0; i<tanksAndOrders.length; i++) {

		var orders = tanksAndOrders[i]["orders"];
		if (!orders)
			continue; // no orders given for this tank
		
		var tank = tanksAndOrders[i]["tank"];
		
		tank.move(orders["heading"]);
	}
	
	// check for collisions with terrain/blockhouses, undo move if necessary (retaining new heading)
	for (var i=0; i<tanksAndOrders.length; i++) {
		var tank = tanksAndOrders[i]["tank"];
		
		var tile = this.battlefield[tank.getLocation().getY()][tank.getLocation().getX()];
		if (!tile.canMove() || (tile.getUnit() && tile.getUnit().getType() == "Blockhouse")) {
			tank.location = oldLocations[tank];
			tank.immobilize();
		}
	}	
	
	// check for collisions with tanks, undo moves if necessary (retaining new heading)
	// collision checking is restarted each time a tank collision is resolved until all collisions are resolved
	
	var collisionsResolved = false;
	while (!collisionsResolved) {
		collisionsResolved = true;

		for (var i=0; i<tanksAndOrders.length; i++) {
			var tank = tanksAndOrders[i]["tank"];
			
			var occupySameLoc = [tank];
			for (var j=i+1; j<tanksAndOrders.length; j++) {
				var tank2 = tanksAndOrders[j]["tank"];
				if (tank.getLocation().isEqual(tank2.getLocation()))
					occupySameLoc.push(tank2);
			}
			
			if (occupySameLoc.length > 1) {
				for (var occupant in occupySameLoc) {
					occupant.location = oldLocations[occupant];
					occupant.immobilize();
				}
				collisionsResolved = false;
				break; // restart collision resolution
			}
		}
	}
	
	
	// check if tanks ended up in water and immobilize them
	for (var i=0; i<tanksAndOrders.length; i++) {
		var tank = tanksAndOrders[i]["tank"];
		var tile = this.battlefield[tank.getLocation().getY()][tank.getLocation().getX()];
		
		if (tile.immobilizes()) 
			tank.immobilize();			
	}
	
	
	// update battlefield state with new tank locations
	for (var tank in oldLocations) {
		var tile = this.battlefield[tank.getLocation().getY()][tank.getLocation().getX()];
		tile.clearUnit();
	}
	for (var i=0; i<tanksAndOrders.length; i++) {	
		var tank = tanksAndOrders[i]["tank"];
		var tile = this.battlefield[tank.getLocation().getY()][tank.getLocation().getX()];
		tile.setUnit(tank);
	}	
	// move (end)
	
	
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