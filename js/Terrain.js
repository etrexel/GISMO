var Terrain = function (terrain_type) {
    this.type = terrain_type;
    this.move_into = false;
    this.see_thru = false;
    this.fire_thru = false;

    if (terrain_type === 0) {
        this.move_into = true;
        this.see_thru = true;
        this.fire_thru = true;
    }

    if (terrain_type === 1) {
        this.move_into = true;
        this.see_thru = false;
        this.fire_thru = true;
    }

    if (terrain_type === 2) {
        this.move_into = false;
        this.see_thru = true;
        this.fire_thru = true;
    }
};

Terrain.prototype.getType = function () {
    return this.type;
};

Terrain.prototype.canMove = function () {
    return this.move_into;
};

Terrain.prototype.canFire = function () {
    return this.fire_thru;
};

Terrain.prototype.canSee = function () {
    return this.see_thru;
};