QUnit.test("Location Class Test", function (assert) {
    var testLoc = new Location(5, 2);
    assert.equal(testLoc.getX(), 5, "getX()");
    assert.equal(testLoc.getY(), 2, "getY()");
    testLoc.setLocation(2, 5);
    assert.equal(testLoc.getX(), 2, "setLocation() X");
    assert.equal(testLoc.getY(), 5, "setLocation() Y");
    testLoc.setX(5);
    assert.equal(testLoc.getX(), 5, "setX()");
    testLoc.setY(2);
    assert.equal(testLoc.getY(), 2, "setY()");
    assert.equal(testLoc.isEqual(new Location(5, 2)), true, "isEqual() True");
    assert.equal(testLoc.isEqual(new Location(2, 5)), false, "isEqual() False");
});

QUnit.test("Terrain Class Test", function (assert) {
    var test_type = 0;
    var terrain = new Terrain(test_type);
    assert.equal(terrain.canMove(), true, "Plain Move");
    assert.equal(terrain.canSee(), true, "Plain See");
    assert.equal(terrain.canFire(), true, "Plain Fire");
    test_type = 1;
    terrain = new Terrain(test_type);
    assert.equal(terrain.canMove(), true, "Forest Move");
    assert.equal(terrain.canSee(), false, "Forest See");
    assert.equal(terrain.canFire(), true, "Forest Fire");
    test_type = 2;
    terrain = new Terrain(test_type);
    assert.equal(terrain.canMove(), false, "Water Move");
    assert.equal(terrain.canSee(), true,"Water See");
    assert.equal(terrain.canFire(), true, "Water Fire");
    test_type = 3;
    terrain = new Terrain(test_type);
    assert.equal(terrain.canMove(), false, "Mountain Move");
    assert.equal(terrain.canSee(), false,"Mountain See");
    assert.equal(terrain.canFire(), false, "Mountain Fire");
});

QUnit.test("Unit Class Test", function (assert) {
    var test_location = new Location(4, 5);
    var test_unit = new Unit("Unit", "red", test_location);
    assert.equal(test_unit.getType(), "Unit", "getType()");
    assert.equal(test_unit.getFaction(), "red", "getFaction()");
    assert.equal(test_unit.getHealth(), 0, "getHealth()");
    test_unit.hit(3);
    assert.equal(test_unit.getHealth(), 0, "hit()");
    assert.equal(test_unit.getLocation().isEqual(test_location), true, "getLocation()");
});

QUnit.test("Blockhouse Class Test", function (assert) {
    var test_location = new Location(5, 4);
    var test_blockhouse = new Blockhouse("red", test_location);
    assert.equal(test_blockhouse.getType(), "Blockhouse", "getType()");
    assert.equal(test_blockhouse.getHealth(), 3, "getHeath()");
    assert.equal(test_blockhouse.getLocation().isEqual(test_location), true, "getLocation()");
    assert.equal(test_blockhouse.getFaction(), "red", "getFaction()");
    test_blockhouse.hit(2);
    assert.equal(test_blockhouse.getHealth(), 1, "hit()");
});

QUnit.test("Tank Class Test", function (assert) {
    var test_location = new Location(5, 4);
    var new_location = new Location(10, 10);
    var test_tank = new Tank("red", test_location, "S", "S");
    assert.equal(test_tank.getType(), "Tank", "getType()");
    assert.equal(test_tank.getFaction(), "red", "getFaction()");
    assert.equal(test_tank.getHealth(), 2, "getHealth()");
    assert.equal(test_tank.getLocation().isEqual(test_location), true, "getLocation()");
    assert.equal(test_tank.getSpeed(), 0, "getSpeed()");
    test_tank.setSpeed(2);
    assert.equal(test_tank.getSpeed(), 1, "setSpeed()");
    test_tank.setSpeed(2);
    test_tank.setSpeed(3);
    assert.equal(test_tank.getSpeed(), 2, "setSpeed() Ceiling");
    test_tank.setSpeed(-2);
    test_tank.setSpeed(-2);
    test_tank.setSpeed(-2);
    test_tank.setSpeed(-2);
    assert.equal(test_tank.getSpeed(), -1, "setSpeed() Floor");
    assert.equal(test_tank.canMove(), true, "canMove() True");
    test_tank.hit(1);
    assert.equal(test_tank.canMove(), false, "canMove() False");
    assert.equal(test_tank.getHealth(), 1, "hit()");
    assert.equal(test_tank.getTurret(), "S", "getTurret()");
    test_tank.setTurret("SE");
    assert.equal(test_tank.getTurret(), "SE", "setTurret()");
    test_tank.setTurret("NE");
    test_tank.setTurret("N");
    test_tank.setTurret("NW");
    assert.equal(test_tank.getTurret(), "NW", "setTurret() Low Edge");
    test_tank.setTurret("N");
    assert.equal(test_tank.getTurret(), "N", "setTurret() High Edge");
    assert.equal(test_tank.gunReady(), true, "gunReady()");
    var ret = test_tank.fire();
    test_tank.fire();
    assert.equal(true, ret, "fire() True");
    assert.equal(test_tank.fire(), false, "fire() False");
    assert.equal(test_tank.gunReady(), false, "fire()");
    test_tank.reload();
    assert.equal(test_tank.gunReady(), true, "reload()");
    for(var i=0; i<40; i++){
        test_tank.fire();
        test_tank.reload();
    }
    test_tank.reload();
    assert.equal(test_tank.gunReady(), false, "Out of Rounds");
    test_tank.setLocation(new_location.getX(), new_location.getY());
    assert.equal(test_tank.getLocation().isEqual(new_location), true, "setLocation()");
    assert.equal(test_tank.canFire(), true, "canFire() True");
    assert.equal(test_tank.isDestroyed(), false, "isDestroyed() False");
    test_tank.hit(2);
    assert.equal(test_tank.canFire(), false, "canFire() False");
    assert.equal(test_tank.isDestroyed(), true, "isDestroyed() True");
    //SPEED = 0
    //W->S
    test_tank = new Tank("red", new Location(10, 10), "W", "W");
    test_tank.move("S");
    assert.equal(test_tank.getHeading(), "S", "Speed 0 W->S Heading");
    assert.equal(test_tank.getTurret(), "S", "Speed 0 W->S Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 W->S Coordinates");
    //W->SW
    test_tank = new Tank("red", new Location(10, 10), "W", "W");
    test_tank.move("SW");
    assert.equal(test_tank.getHeading(), "SW", "Speed 0 W->SW Heading");
    assert.equal(test_tank.getTurret(), "SW", "Speed 0 W->SW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 W->SW Coordinates");
    //W->NW
    test_tank = new Tank("red", new Location(10, 10), "W", "W");
    test_tank.move("NW");
    assert.equal(test_tank.getHeading(), "NW", "Speed 0 N->NW Heading");
    assert.equal(test_tank.getTurret(), "NW", "Speed 0 N->NW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 N->NW Coordinates");
    //W->N
    test_tank = new Tank("red", new Location(10, 10), "W", "W");
    test_tank.move("N");
    assert.equal(test_tank.getHeading(), "N", "Speed 0 W->N Heading");
    assert.equal(test_tank.getTurret(), "N", "Speed 0 W->N Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 W->N Coordinates");
    //NW->SW
    test_tank = new Tank("red", new Location(10, 10), "NW", "NW");
    test_tank.move("SW");
    assert.equal(test_tank.getHeading(), "SW", "Speed 0 NW->SW Heading");
    assert.equal(test_tank.getTurret(), "SW", "Speed 0 NW->SW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 NW->SW Coordinates");
    //NW->W
    test_tank = new Tank("red", new Location(10, 10), "NW", "NW");
    test_tank.move("W");
    assert.equal(test_tank.getHeading(), "W", "Speed 0 NW->W Heading");
    assert.equal(test_tank.getTurret(), "W", "Speed 0 NW->W Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 NW->W Coordinates");
    //NW->N
    test_tank = new Tank("red", new Location(10, 10), "NW", "NW");
    test_tank.move("N");
    assert.equal(test_tank.getHeading(), "N", "Speed 0 NW->N Heading");
    assert.equal(test_tank.getTurret(), "N", "Speed 0 NW->N Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 NW->N Coordinates");
    //NW->NE
    test_tank = new Tank("red", new Location(10, 10), "NW", "NW");
    test_tank.move("NE");
    assert.equal(test_tank.getHeading(), "NE", "Speed 0 NW->NE Heading");
    assert.equal(test_tank.getTurret(), "NE", "Speed 0 NW->NE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 NW->NE Coordinates");
    //N->W
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.move("W");
    assert.equal(test_tank.getHeading(), "W", "Speed 0 N->W Heading");
    assert.equal(test_tank.getTurret(), "W", "Speed 0 N->W Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 N->W Coordinates");
    //N->NW
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.move("NW");
    assert.equal(test_tank.getHeading(), "NW", "Speed 0 N->NW Heading");
    assert.equal(test_tank.getTurret(), "NW", "Speed 0 N->NW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 N->NW Coordinates");
    //N->NE
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.move("NE");
    assert.equal(test_tank.getHeading(), "NE", "Speed 0 N->NE Heading");
    assert.equal(test_tank.getTurret(), "NE", "Speed 0 N->NE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 N->NE Coordinates");
    //N->E
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.move("E");
    assert.equal(test_tank.getHeading(), "E", "Speed 0 N->E Heading");
    assert.equal(test_tank.getTurret(), "E", "Speed 0 N->E Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 N->E Coordinates");
    //NE->NW
    test_tank = new Tank("red", new Location(10, 10), "NE", "NE");
    test_tank.move("NW");
    assert.equal(test_tank.getHeading(), "NW", "Speed 0 NE->NW Heading");
    assert.equal(test_tank.getTurret(), "NW", "Speed 0 NE->NW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 NE->NW Coordinates");
    //NE->N
    test_tank = new Tank("red", new Location(10, 10), "NE", "NE");
    test_tank.move("N");
    assert.equal(test_tank.getHeading(), "N", "Speed 0 NE->N Heading");
    assert.equal(test_tank.getTurret(), "N", "Speed 0 NE->N Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 NE->N Coordinates");
    //NE->E
    test_tank = new Tank("red", new Location(10, 10), "NE", "NE");
    test_tank.move("E");
    assert.equal(test_tank.getHeading(), "E", "Speed 0 NE->E Heading");
    assert.equal(test_tank.getTurret(), "E", "Speed 0 NE->E Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 NE->E Coordinates");
    //NE->SE
    test_tank = new Tank("red", new Location(10, 10), "NE", "NE");
    test_tank.move("SE");
    assert.equal(test_tank.getHeading(), "SE", "Speed 0 NE->SE Heading");
    assert.equal(test_tank.getTurret(), "SE", "Speed 0 NE->SE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 NE->SE Coordinates");
    //Separate Turret and Heading
    test_tank = new Tank("red", new Location(10, 10), "S", "W");
    test_tank.move("W");
    assert.equal(test_tank.getHeading(), "W", "Speed 0 S->W Heading");
    assert.equal(test_tank.getTurret(), "N", "Speed 0 W->N Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 10)), true, "Speed 0 S->W Coordinates");
    //SPEED = 1
    //N->N
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.setSpeed(1);
    test_tank.move("N");
    assert.equal(test_tank.getHeading(), "N", "Speed 1 N->NE Heading");
    assert.equal(test_tank.getTurret(), "N", "Speed 1 N->NE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 9)), true, "Speed 1 N->NE Coordinates");
    //N->NW
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.setSpeed(1);
    test_tank.move("NW");
    assert.equal(test_tank.getHeading(), "NW", "Speed 1 N->NW Heading");
    assert.equal(test_tank.getTurret(), "NW", "Speed 1 N->NW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(9, 9)), true, "Speed 1 N->NW Coordinates");
    //N->NE
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.setSpeed(1);
    test_tank.move("NE");
    assert.equal(test_tank.getHeading(), "NE", "Speed 1 N->NE Heading");
    assert.equal(test_tank.getTurret(), "NE", "Speed 1 N->NE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(11, 9)), true, "Speed 1 N->NE Coordinates");
    //S->S
    test_tank = new Tank("red", new Location(10, 10), "S", "S");
    test_tank.setSpeed(1);
    test_tank.move("S");
    assert.equal(test_tank.getHeading(), "S", "Speed 1 S->S Heading");
    assert.equal(test_tank.getTurret(), "S", "Speed 1 S->S Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 11)), true, "Speed 1 S->S Coordinates");
    //S->SW
    test_tank = new Tank("red", new Location(10, 10), "S", "S");
    test_tank.setSpeed(1);
    test_tank.move("SW");
    assert.equal(test_tank.getHeading(), "SW", "Speed 1 S->SW Heading");
    assert.equal(test_tank.getTurret(), "SW", "Speed 1 S->SW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(9, 11)), true, "Speed 1 S->SW Coordinates");
    //S->SE
    test_tank = new Tank("red", new Location(10, 10), "S", "S");
    test_tank.setSpeed(1);
    test_tank.move("SE");
    assert.equal(test_tank.getHeading(), "SE", "Speed 1 S->SE Heading");
    assert.equal(test_tank.getTurret(), "SE", "Speed 1 S->SE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(11, 11)), true, "Speed 1 S->SE Coordinates");
    //Separate Turret and Heading
    test_tank = new Tank("red", new Location(10, 10), "S", "SE");
    test_tank.setSpeed(1);
    test_tank.move("SE");
    assert.equal(test_tank.getHeading(), "SE", "Speed 1 S->SE Heading");
    assert.equal(test_tank.getTurret(), "E", "Speed 1 SE->E Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(11, 11)), true, "Speed 1 S->SE Coordinates");
    //SPEED = -1
    //N->N
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.setSpeed(-1);
    test_tank.move("N");
    assert.equal(test_tank.getHeading(), "N", "Speed -1 N->NE Heading");
    assert.equal(test_tank.getTurret(), "N", "Speed -1 N->NE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 11)), true, "Speed -1 N->NE Coordinates");
    //N->NW
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.setSpeed(-1);
    test_tank.move("NW");
    assert.equal(test_tank.getHeading(), "NW", "Speed -1 N->NW Heading");
    assert.equal(test_tank.getTurret(), "NW", "Speed -1 N->NW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(11, 11)), true, "Speed -1 N->NW Coordinates");
    //N->NE
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.setSpeed(-1);
    test_tank.move("NE");
    assert.equal(test_tank.getHeading(), "NE", "Speed -1 N->NE Heading");
    assert.equal(test_tank.getTurret(), "NE", "Speed -1 N->NE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(9, 11)), true, "Speed -1 N->NE Coordinates");
    //S->S
    test_tank = new Tank("red", new Location(10, 10), "S", "S");
    test_tank.setSpeed(-1);
    test_tank.move("S");
    assert.equal(test_tank.getHeading(), "S", "Speed -1 S->S Heading");
    assert.equal(test_tank.getTurret(), "S", "Speed -1 S->S Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 9)), true, "Speed -1 S->S Coordinates");
    //S->SW
    test_tank = new Tank("red", new Location(10, 10), "S", "S");
    test_tank.setSpeed(-1);
    test_tank.move("SW");
    assert.equal(test_tank.getHeading(), "SW", "Speed -1 S->SW Heading");
    assert.equal(test_tank.getTurret(), "SW", "Speed -1 S->SW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(11, 9)), true, "Speed -1 S->SW Coordinates");
    //S->SE
    test_tank = new Tank("red", new Location(10, 10), "S", "S");
    test_tank.setSpeed(-1);
    test_tank.move("SE");
    assert.equal(test_tank.getHeading(), "SE", "Speed -1 S->SE Heading");
    assert.equal(test_tank.getTurret(), "SE", "Speed -1 S->SE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(9, 9)), true, "Speed -1 S->SE Coordinates");
    //Separate Turret and Heading
    test_tank = new Tank("red", new Location(10, 10), "E", "W");
    test_tank.setSpeed(-1);
    test_tank.move("SE");
    assert.equal(test_tank.getHeading(), "SE", "Speed -1 E->SE Heading");
    assert.equal(test_tank.getTurret(), "NW", "Speed -1 W->NW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(9, 9)), true, "Speed -1 E->SE Coordinates");
    //SPEED = 2
    //N->N
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.setSpeed(1);
    test_tank.setSpeed(2);
    test_tank.move("N");
    assert.equal(test_tank.getHeading(), "N", "Speed 2 N->N Heading");
    assert.equal(test_tank.getTurret(), "N", "Speed 2 N->N Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 8)), true, "Speed 2 N->N Coordinates");
    //N->NW
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.setSpeed(1);
    test_tank.setSpeed(2);
    test_tank.move("NW");
    assert.equal(test_tank.getHeading(), "NW", "Speed 2 N->NW Heading");
    assert.equal(test_tank.getTurret(), "NW", "Speed 2 N->NW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(9, 8)), true, "Speed 2 N->NW Coordinates");
    //N->NE
    test_tank = new Tank("red", new Location(10, 10), "N", "N");
    test_tank.setSpeed(1);
    test_tank.setSpeed(2);
    test_tank.move("NE");
    assert.equal(test_tank.getHeading(), "NE", "Speed 2 N->NE Heading");
    assert.equal(test_tank.getTurret(), "NE", "Speed 2 N->NE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(11, 8)), true, "Speed 2 N->NE Coordinates");
    //S->S
    test_tank = new Tank("red", new Location(10, 10), "S", "S");
    test_tank.setSpeed(1);
    test_tank.setSpeed(2);
    test_tank.move("S");
    assert.equal(test_tank.getHeading(), "S", "Speed 2 S->S Heading");
    assert.equal(test_tank.getTurret(), "S", "Speed 2 S->S Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(10, 12)), true, "Speed 2 S->S Coordinates");
    //S->SW
    test_tank = new Tank("red", new Location(10, 10), "S", "S");
    test_tank.setSpeed(1);
    test_tank.setSpeed(2);
    test_tank.move("SW");
    assert.equal(test_tank.getHeading(), "SW", "Speed 2 S->SW Heading");
    assert.equal(test_tank.getTurret(), "SW", "Speed 2 S->SW Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(9, 12)), true, "Speed 2 S->SW Coordinates");
    //S->SE
    test_tank = new Tank("red", new Location(10, 10), "S", "S");
    test_tank.setSpeed(1);
    test_tank.setSpeed(2);
    test_tank.move("SE");
    assert.equal(test_tank.getHeading(), "SE", "Speed 2 S->SE Heading");
    assert.equal(test_tank.getTurret(), "SE", "Speed 2 S->SE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(11, 12)), true, "Speed 2 S->SE Coordinates");
    //Separate Turret and Heading
    test_tank = new Tank("red", new Location(10, 10), "W", "E");
    test_tank.setSpeed(1);
    test_tank.setSpeed(2);
    test_tank.move("NW");
    assert.equal(test_tank.getHeading(), "NW", "Speed 2 W->NW Heading");
    assert.equal(test_tank.getTurret(), "SE", "Speed 2 E->SE Turret");
    assert.equal(test_tank.getLocation().isEqual(new Location(8, 9)), true, "Speed 2 W->NW Coordinates");
});

QUnit.test("Tile Class Test", function (assert) {
    var test_tile = new Tile(new Terrain("plain"));
    assert.equal(test_tile.getTerrain().getType(), "plain", "getTerrain()");
    assert.equal(test_tile.getUnit(), null, "getUnit() NULL");
    test_tile.setUnit(new Blockhouse("red", new Location(5, 5)));
    assert.equal(test_tile.getUnit().getType(), "Blockhouse", "getUnit() Blockhouse");
    test_tile.setUnit(new Tank("red", new Location(5, 5), "N", "N"));
    assert.equal(test_tile.getUnit().getType(), "Tank", "getUnit() Tank");
    test_tile.clearUnit();
    assert.equal(test_tile.getUnit(), null, "clearUnit()");
    assert.equal(test_tile.hasSmoke(), false, "hasSmoke()");
    test_tile.setSmoke(true);
    assert.equal(test_tile.hasSmoke(), true, "setSmoke()");
});

