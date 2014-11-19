var Tile = function(tile_terrain){
	var terrain = tile_terrain;
	var unit = null;
	var smoke = false;

	this.getTerrain = function(){
		return terrain;
	};

	this.getUnit = function(){
		if(unit)
			return unit;
		return null;
	};

	this.setUnit = function(new_unit){
		unit = new_unit;
	};

	this.setSmoke = function(smokeVal){
		smoke = smokeVal;
	};

	this.hasSmoke = function(){
		return smoke;
	};
};