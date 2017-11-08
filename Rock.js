// ====
// ROCK
// ====

"use strict";

var shootingRate = 10;

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Rock(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
	
	this.velX = 1;
	this._turnAroundNext = false;

    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.alien;
    //this.scale  = this.scale  || 1;

};

Rock.prototype = new Entity();

Rock.prototype.KEY_FIRE   = ' '.charCodeAt(0);
Rock.prototype.rotation = 0;
Rock.prototype.cx = 100;
Rock.prototype.cy = 200;
Rock.prototype.velX = 0;
Rock.prototype.velY = 0;
Rock.prototype.launchVel = 2;
Rock.prototype.friendOrFoe = true;


Rock.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death

	spatialManager.unregister(this);
	
	//if(this.cy > g_canvas.height - (this.sprite.height / 2)) 

	this.fireAlienBullet();

	if(this._isDeadNow) return entityManager.KILL_ME_NOW;

	if(this._turnAroundNext) {
		this.velX = -this.velX;
		this.cx += this.velX * du;
		this.cy += 5;
		this._turnAroundNext = false;
	}
	else {
		this.cx += this.velX * du;
		if(this.cx > entityManager.ALIEN_TURN_MAX ||
		   this.cx < entityManager.ALIEN_TURN_MIN) {
			entityManager.turnAliensNextUpdate();
		}
	}

    // TODO: YOUR STUFF HERE! --- (Re-)Register

	spatialManager.register(this);

};

Rock.prototype.getRadius = function () {
    return (this.sprite.width / 2);
};

Rock.prototype.evaporateSound = new Audio(
  "sounds/rockEvaporate.ogg");

Rock.prototype.takeBulletHit = function () {

    this.kill();

    this.evaporateSound.play();
};

// For when we implement shooting aliens
Rock.prototype.fireAlienBullet = function () {
  var enemy = getFiringEnemy();
  if (enemy == null) {
    return;
  }

  if (entityManager._alienbullets.length < TEMPALIENMAGAZINE) {
    var dX = +Math.sin(Math.PI);
    var dY = -Math.cos(Math.PI);
    var launchDist = this.getRadius() * 1.2;

    var relVel = this.launchVel;
    var relVelX = dX * relVel;
    var relVelY = dY * relVel;

    entityManager.fireEnemyBullet(
       enemy.cx + dX * launchDist, enemy.cy + dY * launchDist,
       relVelX, relVelY,
       enemy.rotation, true);

  }
};

Rock.prototype.turnAround = function () {
	this._turnAroundNext = true;
}


Rock.prototype.render = function (ctx) { 
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, 0
    );
};


function getFiringEnemy(){
  // næst handle undefined enemys
  return  entityManager._rocks[Math.floor((Math.random() * entityManager._rocks.length) + 0)];
}
