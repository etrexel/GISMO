var Terrain = function(terrain_type){
    this.type = terrain_type;
    this.move_into = false;
    this.see_thru = false;
    this.fire_thru = false;

    if(terrain_type == "plain"){
        this.move_into = true;
        this.see_thru = true;
        this.fire_thru = true;
    }

    if(terrain_type == "forest"){
        this.move_into = true;
        this.see_thru = false;
        this.fire_thru = true;
    }

    if(terrain_type == "water"){
        this.move_into = false;
        this.see_thru = true;
        this.fire_thru = true;
    }
};

Terrain.prototype.getType = function(){
    return this.type;
};

Terrain.prototype.canMove = function(){
    return this.move_into;
};

Terrain.prototype.canFire = function(){
    return this.fire_thru;
};

Terrain.prototype.canSee = function(){
    return this.see_thru;
};