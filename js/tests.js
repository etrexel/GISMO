QUnit.test("Location Class Test", function(assert){
    var testX = 5;
    var testY = 2;
    var testLoc = new Location(testX, testY);
    assert.equal(testLoc.getX(), testX, "getX()");
    assert.equal(testLoc.getY(), testY, "getY()");
    testLoc.setLocation(testY, testX);
    assert.equal(testLoc.getX(), testY, "setLocation() X");
    assert.equal(testLoc.getY(), testX, "setLocation() Y");
    testLoc.setX(testX);
    assert.equal(testLoc.getX(), testX, "setX()");
    testLoc.setY(testY);
    assert.equal(testLoc.getY(), testY, "setY() Pass");
    assert.equal(testLoc.isEqual(new Location(testX, testY)), true, "isEqual() True");
    assert.equal(testLoc.isEqual(new Location(testY, testX)), false, "isEqual() False");
});

QUnit.test("Terrain Class Test", function(assert){
    var test_type = "plain";
    var terrain = new Terrain(test_type);
    assert.equal(terrain.canMove(), true, "Plain Move");
    assert.equal(terrain.canSee(), true, "Plain See");
    assert.equal(terrain.canFire(), true, "Plain Fire");
    test_type = "forest";
    terrain = new Terrain(test_type);
    assert.equal(terrain.canMove(), true, "Forest Move");
    assert.equal(terrain.canSee(), false, "Forest See");
    assert.equal(terrain.canFire(), true, "Forest Fire");
    test_type = "water";
    terrain = new Terrain(test_type);
    assert.equal(terrain.canMove(), false, "Water Move");
    assert.equal(terrain.canSee(), true,"Water See");
    assert.equal(terrain.canFire(), true, "Water Fire");
    test_type = "mountain";
    terrain = new Terrain(test_type);
    assert.equal(terrain.canMove(), false, "Mountain Move");
    assert.equal(terrain.canSee(), false,"Mountain See");
    assert.equal(terrain.canFire(), false, "Mountain Fire");
});