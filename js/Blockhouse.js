var Blockhouse = function(blockhouse_faction, blockhouse_location){
    Unit.call(this, "Blockhouse", blockhouse_faction, blockhouse_location);
    this.health = 3;
};

Blockhouse.prototype = Object.create(Unit.prototype);