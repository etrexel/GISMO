var Tank = function (tank_faction, tank_location, tank_heading, tank_turret) {
    Unit.call(this, "Tank", tank_faction, tank_location);
    this.health = 2;
    this.speed = 0;
    switch (tank_heading) {
        case "N":
            this.heading = 0;
            break;
        case "NE":
            this.heading = 1;
            break;
        case "E":
            this.heading = 2;
            break;
        case "SE":
            this.heading = 3;
            break;
        case "S":
            this.heading = 4;
            break;
        case "SW":
            this.heading = 5;
            break;
        case "W":
            this.heading = 6;
            break;
        case "NW":
            this.heading = 7;
            break;
        default:
            this.heading = 0;
            break;
    }
    switch (tank_turret) {
        case "N":
            this.turret = 0;
            break;
        case "NE":
            this.turret = 1;
            break;
        case "E":
            this.turret = 2;
            break;
        case "SE":
            this.turret = 3;
            break;
        case "S":
            this.turret = 4;
            break;
        case "SW":
            this.turret = 5;
            break;
        case "W":
            this.turret = 6;
            break;
        case "NW":
            this.turret = 7;
            break;
    }
    this.magazine = 2;
    this.rounds = 40;
};

Tank.prototype = Object.create(Unit.prototype);

Tank.prototype.getSpeed = function () {
    return this.speed;
};

Tank.prototype.setSpeed = function (new_speed) {
    if (new_speed > this.speed) {
        this.speed += 1;
    } else {
        this.speed -= 1;
    }
    if (this.speed < -1) {
        this.speed = -1;
    }
    if (this.speed > 2) {
        this.speed = 2;
    }
};

Tank.prototype.getTurret = function () {
    switch (this.turret) {
        case 0:
            return "N";
        case 1:
            return "NE";
        case 2:
            return "E";
        case 3:
            return "SE";
        case 4:
            return "S";
        case 5:
            return "SW";
        case 6:
            return "W";
        case 7:
            return "NW";
    }
    return this.turret;
};

/**
 * This function will only modify turret position
 * if it is within 2 clicks of current turret
 * position
 */
Tank.prototype.setTurret = function (new_turret) {
    switch (new_turret) {
        case "N":
            new_turret = 0;
            break;
        case "NE":
            new_turret = 1;
            break;
        case "E":
            new_turret = 2;
            break;
        case "SE":
            new_turret = 3;
            break;
        case "S":
            new_turret = 4;
            break;
        case "SW":
            new_turret = 5;
            break;
        case "W":
            new_turret = 6;
            break;
        case "NW":
            new_turret = 7;
            break;
        default:
            return null;
    }
    if (this.turret === 0) {
        if (new_turret === 7 || new_turret === 6 || new_turret === 1 || new_turret === 2) {
            this.turret = new_turret;
        }
    } else if (this.turret === 1) {
        if (new_turret === 7 || new_turret === 0 || new_turret === 2 || new_turret === 3) {
            this.turret = new_turret;
        }
    } else if (this.turret === 6) {
        if (new_turret === 4 || new_turret === 5 || new_turret === 7 || new_turret === 0) {
            this.turret = new_turret;
        }
    } else if (this.turret === 7) {
        if (new_turret === 5 || new_turret === 6 || new_turret === 0 || new_turret === 1) {
            this.turret = new_turret;
        }
    } else {
        if (new_turret === (this.turret - 2) || new_turret === (this.turret - 1) ||
            new_turret === (this.turret + 1) || new_turret === (this.turret + 2)) {
            this.turret = new_turret;
        }
    }
};

Tank.prototype.getHeading = function () {
    switch (this.heading) {
        case 0:
            return "N";
        case 1:
            return "NE";
        case 2:
            return "E";
        case 3:
            return "SE";
        case 4:
            return "S";
        case 5:
            return "SW";
        case 6:
            return "W";
        case 7:
            return "NW";
    }
    return this.heading;
};

Tank.prototype.gunReady = function () {
    return this.magazine > 0;
};

Tank.prototype.fire = function () {
    if (this.magazine > 0) {
        this.magazine -= 1;
        this.rounds -= 1;
        return 1;
    }
    return 0;
};

Tank.prototype.reload = function () {
    if (this.rounds > 0) {
        this.magazine += 1;
        if (this.magazine > 2) {
            this.magazine = 2;
        }
    }
};

Tank.prototype.setLocation = function (xVal, yVal) {
    this.location.setX(xVal);
    this.location.setY(yVal);
};

Tank.prototype.canMove = function () {
    return this.health > 1;
};

Tank.prototype.canFire = function () {
    return this.health > 0;
};

Tank.prototype.move = function (new_heading) {
    switch (new_heading) {
        case "N":
            new_heading = 0;
            break;
        case "NE":
            new_heading = 1;
            break;
        case "E":
            new_heading = 2;
            break;
        case "SE":
            new_heading = 3;
            break;
        case "S":
            new_heading = 4;
            break;
        case "SW":
            new_heading = 5;
            break;
        case "W":
            new_heading = 6;
            break;
        case "NW":
            new_heading = 7;
            break;
        default:
            return null;
    }
    if (this.canMove()) {
        var turret_move = 0;
        if (this.speed === 2) {
            if (this.heading === 7 || this.heading === 0 || this.heading === 1) {
                this.location.setY(this.location.getY() - 1);
                if (this.heading === 7) {
                    this.location.setX(this.location.getX() - 1);
                }
                if (this.heading === 1) {
                    this.location.setX(this.location.getX() + 1);
                }
            }
            if (this.heading === 5 || this.heading === 4 || this.heading === 3) {
                this.location.setY(this.location.getY() + 1);
                if (this.heading === 5) {
                    this.location.setX(this.location.getX() - 1);
                }
                if (this.heading === 3) {
                    this.location.setX(this.location.getX() + 1);
                }
            }
            if (this.heading === 6) {
                this.location.setX(this.location.getX() - 1);
            }
            if (this.heading === 2) {
                this.location.setX(this.location.getX() + 1);
            }

            if (this.heading === 0) {
                if (new_heading === 7) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 1) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            } else if (this.heading === 1) {
                if (new_heading === 0) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 2) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            } else if (this.heading === 6) {
                if (new_heading === 5) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 7) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            } else if (this.heading === 7) {
                if (new_heading === 6) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 0) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            } else {
                if (new_heading === (this.heading - 1)) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === (this.heading + 1)) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            }

            if (this.heading === 7 || this.heading === 0 || this.heading === 1) {
                this.location.setY(this.location.getY() - 1);
                if (this.heading === 7) {
                    this.location.setX(this.location.getX() - 1);
                }
                if (this.heading === 1) {
                    this.location.setX(this.location.getX() + 1);
                }
            }
            if (this.heading === 5 || this.heading === 4 || this.heading === 3) {
                this.location.setY(this.location.getY() + 1);
                if (this.heading === 5) {
                    this.location.setX(this.location.getX() - 1);
                }
                if (this.heading === 3) {
                    this.location.setX(this.location.getX() + 1);
                }
            }
            if (this.heading === 6) {
                this.location.setX(this.location.getX() - 1);
            }
            if (this.heading === 2) {
                this.location.setX(this.location.getX() + 1);
            }
        }

        if (this.speed === 1 || this.speed === -1) {
            if (this.heading === 0) {
                if (new_heading === 7) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 1) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            } else if (this.heading === 1) {
                if (new_heading === 0) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 2) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            } else if (this.heading === 6) {
                if (new_heading === 5) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 7) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            } else if (this.heading === 7) {
                if (new_heading === 6) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 0) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            } else {
                if (new_heading === (this.heading - 1)) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === (this.heading + 1)) {
                    this.heading = new_heading;
                    turret_move = 1;
                }
            }
            if (this.heading === 7 || this.heading === 0 || this.heading === 1) {
                this.location.setY(this.location.getY() - this.speed);
                if (this.heading === 7) {
                    this.location.setX(this.location.getX() - this.speed);
                }
                if (this.heading === 1) {
                    this.location.setX(this.location.getX() + this.speed);
                }
            }
            if (this.heading === 5 || this.heading === 4 || this.heading === 3) {
                this.location.setY(this.location.getY() + this.speed);
                if (this.heading === 5) {
                    this.location.setX(this.location.getX() - this.speed);
                }
                if (this.heading === 3) {
                    this.location.setX(this.location.getX() + this.speed);
                }
            }
            if (this.heading === 6) {
                this.location.setX(this.location.getX() - this.speed);
            }
            if (this.heading === 2) {
                this.location.setX(this.location.getX() + this.speed);
            }
        }

        if (this.speed === 0) {
            if (this.heading === 0) {
                if (new_heading === 6) {
                    this.heading = new_heading;
                    turret_move = -2;
                } else if (new_heading === 7) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 1) {
                    this.heading = new_heading;
                    turret_move = 1;
                } else if (new_heading === 2) {
                    this.heading = new_heading;
                    turret_move = 2;
                }
            } else if (this.heading === 1) {
                if (new_heading === 7) {
                    this.heading = new_heading;
                    turret_move = -2;
                } else if (new_heading === 0) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 2) {
                    this.heading = new_heading;
                    turret_move = 1;
                } else if (new_heading === 3) {
                    this.heading = new_heading;
                    turret_move = 2;
                }
            } else if (this.heading === 6) {
                if (new_heading === 4) {
                    this.heading = new_heading;
                    turret_move = -2;
                } else if (new_heading === 5) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 7) {
                    this.heading = new_heading;
                    turret_move = 1;
                } else if (new_heading === 0) {
                    this.heading = new_heading;
                    turret_move = 2;
                }
            } else if (this.heading === 7) {
                if (new_heading === 5) {
                    this.heading = new_heading;
                    turret_move = -2;
                } else if (new_heading === 6) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === 0) {
                    this.heading = new_heading;
                    turret_move = 1;
                } else if (new_heading === 1) {
                    this.heading = new_heading;
                    turret_move = 2;
                }
            } else {
                if (new_heading === (this.heading - 2)) {
                    this.heading = new_heading;
                    turret_move = -2;
                } else if (new_heading === (this.heading - 1)) {
                    this.heading = new_heading;
                    turret_move = -1;
                } else if (new_heading === (this.heading + 1)) {
                    this.heading = new_heading;
                    turret_move = 1;
                } else if (new_heading === (this.heading + 2)) {
                    this.heading = new_heading;
                    turret_move = 2;
                }
            }
        }

        if (turret_move === 2) {
            if (this.turret === 7) {
                turret_move = 1;
            } else if (this.turret === 6) {
                turret_move = 0;
            } else {
                turret_move = this.turret + 2;
            }
        } else if (turret_move === 1) {
            if (this.turret === 7) {
                turret_move = 0;
            } else {
                turret_move = this.turret + 1;
            }
        } else if (turret_move === -1) {
            if (this.turret === 0) {
                turret_move = 7;
            } else {
                turret_move = this.turret - 1;
            }
        } else if (turret_move === -2) {
            if (this.turret === 0) {
                turret_move = 6;
            } else if (this.turret === 1) {
                turret_move = 7;
            } else {
                turret_move = this.turret - 2;
            }
        } else {
            turret_move = this.turret;
        }
        this.turret = turret_move;
    }
};

Tank.prototype.isDestroyed = function () {
    return this.health <= 0;
};

Tank.prototype.immobilize = function() {
	if (this.health > 1)
		this.health = 1;
}
