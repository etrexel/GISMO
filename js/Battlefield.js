var Battlefield = function (first_faction, second_faction) {
	this.battlefield = [];
	this.faction1 = first_faction;
	this.faction2 = second_faction;
	this.faction1Base = "";
	this.faction2Base = "";
	this.faction1Tanks = [];
	this.faction2Tanks = [];
    this.changedSpeed = [];
    this.changedDirection = [];
	this.faction1Orders = "";
	this.faction2Orders = "";
	this.faction1Reports = "";
	this.faction2Reports = "";

};

Battlefield.prototype.generateBattlefield = function () {
	var boardSize = 250;

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
					this.battlefield[x - Math.floor(Math.random() * 10) % 2 ][y - Math.floor(Math.random() * 10) % 2 ] = this.battlefield[x][y];
					this.battlefield[x][y - Math.floor(Math.random() * 10) % 2 ] = this.battlefield[x][y];
					this.battlefield[x + Math.floor(Math.random() * 10) % 2 ][y] = this.battlefield[x][y];
					this.battlefield[x][y + Math.floor(Math.random() * 10) % 2 ] = this.battlefield[x][y];
				}
			}
		}
	}


	for(y = 0; y < 10; y++ ) {
		for(x = 0; x < 10; x++ ) {
			this.battlefield[x][y] = new Tile(new Terrain(4));
		}
	}

	for(y = 0; y < 10; y++ ) {
		for(x = 0; x < 10; x++ ) {
			this.battlefield[boardSize - x][boardSize - y] = new Tile(new Terrain(4));
		}
	}

	this.battlefield[5][5] = new Tile(new Terrain(0));
	this.battlefield[boardSize - 5][boardSize - 5] = new Tile(new Terrain(0));
};

Battlefield.prototype.setupTeam = function (faction, json) {
	var tankNumber = 7;

	this.battlefield = Array(tankNumber);


};

Battlefield.prototype.tankReport = function (faction) {

};

Battlefield.prototype.objectReport = function (faction) { /*
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
			// determine if location itself is visible,
		
			var objX = obj["x"];
			var objY = obj["y"];
			var tile = obj["tile"];
			
			// can a tank see smoke on itself? does it need to?
			if (tile.getUnit() === tank)
				continue; // the object is itself, skip
			if (!tile.hasSmoke && tanks.indexOf(tile.getUnit) != -1)
				continue; // the object is a friendly tank, skip 
			
			// check if the object is in one of the wedges of visibility
			// algorithm from GISMO document
			var dx = objX - tankX;
			var dy = objY - tankY;
			
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
						var tile = this.battlefield[tankY+yOffset][tankX+xOffset];
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
						var tile = this.battlefield[tankY+yOffset][tankX+xOffset];
						if (!tile.getTerrain().canSee())
							blocked = true;
						y++;
					}
					
				}
				
				if (!blocked) {
					if (!visibleObjects[obj])
						visibleObjects[obj] = [];
					visibleObjects[obj].push(tank);
				}
			}
		}
	}
	for (var obj in visibleObjects) {
		var x = obj["x"];
		var y = obj["y"];
		var seenBy = visibleObjects[obj];
		if (obj["tile"].hasSmoke()) {
			// add to report => smoke at (x,y) seen by seenBy			
		}
		var unit = obj["tile"].getUnit();
		if (unit) {
			// add to report => unit at (x,y) seen by seenBy			
		}			
	} */
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

};

Battlefield.prototype.clearOrders = function () {
	this.faction1Orders = "";
	this.faction2Orders = "";
};

Battlefield.prototype.updateBattlefield = function () {

};

Battlefield.prototype.checkVictory = function () {
	return null;
};

Battlefield.prototype.sendReports = function () {

};

Battlefield.prototype.tick = function () {
	this.executeOrders();
	this.clearOrders();
	this.updateBattlefield();
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