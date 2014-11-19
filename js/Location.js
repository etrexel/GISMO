var Location = function(xVal, yVal){
    this.x = xVal;
    this.y = yVal;
};

Location.prototype.setLocation = function(xVal, yVal){
    this.x = xVal;
    this.y = yVal;
};

Location.prototype.setX = function(xVal){
    this.x = xVal;
};

Location.prototype.setY = function(yVal){
    this.y = yVal;
};

Location.prototype.getX = function(){
    return this.x;
};

Location.prototype.getY = function(){
    return this.y;
};

Location.prototype.isEqual = function(loc){
    return !!(loc.getX() == this.x && loc.getY() == this.y);
};