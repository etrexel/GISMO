var Unit = function(unit_type, unit_faction, unit_location){
    this.type = unit_type;
    this.health = 0;
    this.faction = unit_faction;
    this.location = unit_location;
};

Unit.prototype.getType = function(){
    return this.type;
}

Unit.prototype.getLocation = function(){
    return this.location;
};

Unit.prototype.getFaction = function(){
    return this.faction;
};

Unit.prototype.getHealth = function(){
    return this.health;
};

Unit.prototype.hit = function(damage){
    this.health = this.health - damage;
    if(this.health < 0)
        this.health = 0;
};