var Unit = function(unit_team, unit_location){
    var health;
    var team = unit_team;
    var location = unit_location;

    this.getTeam = function(){
        return team;
    };

    this.getHealth = function(){
        return health;
    };

    this.hit = function(damage){
        health = health - damage;
        if(health < 0)
            health = 0;
    };
};