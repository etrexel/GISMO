var Location = function(xVal, yVal){
    var x = xVal;
    var y = yVal;

    this.setLocation = function(xVal, yVal){
        x = xVal;
        y = yVal;
    };

    this.setX = function(xVal){
        x = xVal;
    };

    this.setY = function(yVal){
        y = yVal;
    };

    this.getX = function(){
        return x;
    };

    this.getY = function(){
        return y;
    };

    this.isEqual = function(loc){
        return !!(loc.getX() == x && loc.getY() == y);
    };
};