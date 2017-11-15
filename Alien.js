// ====
// ALIEN
// ====

"use strict";

var shootingRate = 10;

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Alien(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

	this.velX = 1;
	this._turnAroundNext = false;

    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.alien;
    //this.scale  = this.scale  || 1;

};

Alien.prototype = new Entity();

Alien.prototype.KEY_FIRE   = ' '.charCodeAt(0);
Alien.prototype.rotation = 0;
Alien.prototype.cx = 100;
Alien.prototype.cy = 200;
Alien.prototype.velX = 0;
Alien.prototype.velY = 0;
Alien.prototype.launchVel = 2;
Alien.prototype.friendOrFoe = true;


Alien.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death

	spatialManager.unregister(this);

	//if(this.cy > g_canvas.height - (this.sprite.height / 2))

	this.fireAlienBullet();

	if(this._isDeadNow) return entityManager.KILL_ME_NOW;

	if(this.cy > 500) {
		g_gameOver = true;
		return;
	}

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

Alien.prototype.getRadius = function () {
    return (this.sprite.width / 2);
};

Alien.prototype.evaporateSound = new Audio(
  "sounds/alienEvaporate.ogg");

Alien.prototype.takeBulletHit = function () {

    this.kill();

    this.evaporateSound.play();

    //update score
    g_score += g_score_enemies;
};

// For when we implement shooting aliens
Alien.prototype.fireAlienBullet = function () {
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

Alien.prototype.turnAround = function () {
	this._turnAroundNext = true;
}


Alien.prototype.render = function (ctx) {
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, 0
    );
};


function getFiringEnemy(){
  // næst handle undefined enemys
  return  entityManager._aliens[Math.floor((Math.random() * entityManager._aliens.length) + 0)];
}
