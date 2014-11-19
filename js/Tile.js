var Tile = function(tile_terrain){
	this.terrain = tile_terrain;
	this.unit = null;
	this.smoke = false;
};

Tile.prototype.getTerrain = function(){
	return this.terrain;
};

Tile.prototype.getUnit = function(){
	if(this.unit)
		return this.unit;
	return null;
};

Tile.prototype.setUnit = function(new_unit){
	this.unit = new_unit;
};

Tile.prototype.clearUnit = function(){
	this.unit = null;
};

Tile.prototype.setSmoke = function(smokeVal){
	this.smoke = smokeVal;
};

Tile.prototype.hasSmoke = function(){
	return this.smoke;
};