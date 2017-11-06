// ====
// ROCK
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Rock(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    //this.randomisePosition();
    //this.randomiseVelocity();

	this.velX = 1;
	this._turnAroundNext = false;

    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.rock;
    //this.scale  = this.scale  || 1;

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/



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


/*Rock.prototype.randomisePosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = this.cy || Math.random() * g_canvas.height;
    this.rotation = this.rotation || 0;
};*/

/*Rock.prototype.randomiseVelocity = function () {
    var MIN_SPEED = 20,
        MAX_SPEED = 70;

    var speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
    var dirn = Math.random() * consts.FULL_CIRCLE;

    this.velX = this.velX || speed * Math.cos(dirn);
    this.velY = this.velY || speed * Math.sin(dirn);

    var MIN_ROT_SPEED = 0.5,
        MAX_ROT_SPEED = 2.5;

    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
};*/

Rock.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death

	spatialManager.unregister(this);
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


    /*this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    this.wrapPosition();*/

    // TODO: YOUR STUFF HERE! --- (Re-)Register

	spatialManager.register(this);

};

Rock.prototype.getRadius = function () {
    return (this.sprite.width / 2);
};

// HACKED-IN AUDIO (no preloading)
//Rock.prototype.splitSound = new Audio(
//  "sounds/rockSplit.ogg");
Rock.prototype.evaporateSound = new Audio(
  "sounds/rockEvaporate.ogg");

Rock.prototype.takeBulletHit = function () {

    this.kill();

    /* if (this.scale > 0.25) {
        this._spawnFragment();
        this._spawnFragment();

        this.splitSound.play();
    } else { */
    this.evaporateSound.play();
    //}
};

// For when we implement shooting aliens
Rock.prototype.fireAlienBullet = function () {
  if (keys[this.KEY_FIRE]) {
    var enemy = getFiringEnemy();
    if (enemy == null) {
      return;
    }

    if (entityManager._alienbullets.length < ALIENMAGAZINE) {
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

  }
};

Rock.prototype.turnAround = function () {
	this._turnAroundNext = true;
}

/*Rock.prototype._spawnFragment = function () {
    entityManager.generateRock({
        cx : this.cx,
        cy : this.cy,
        scale : this.scale /2
    });
};*/

Rock.prototype.render = function (ctx) {
    // var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    // this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, 0
    );
};


function getFiringEnemy(){
  // næst handle undefined enemys
  return  entityManager._rocks[Math.floor((Math.random() * entityManager._rocks.length) + 0)];
}
