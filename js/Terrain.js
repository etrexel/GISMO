var Terrain = function(terrain_type){
    var type = terrain_type;
    var move_into = false;
    var see_thru = false;
    var fire_thru = false;

    if(terrain_type == "plain"){
        move_into = true;
        see_thru = true;
        fire_thru = true;
    }

    if(terrain_type == "forest"){
        move_into = true;
        see_thru = false;
        fire_thru = true;
    }

    if(terrain_type == "water"){
        move_into = false;
        see_thru = true;
        fire_thru = true;
    }

    this.getType = function(){
        return type;
    };

    this.canMove = function(){
        return move_into;
    };

    this.canFire = function(){
        return fire_thru;
    };

    this.canSee = function(){
        return see_thru;
    }
};