// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    this.fireSound.play();

    this.sprite = this.sprite || g_sprites.bullet;

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Bullet.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");

// Magazine
var MAGAZINE = 3;
var ALIENMAGAZINE = 5;
var TEMPALIENMAGAZINE = 1;
// Spray gun
var g_sprayGunB = false;
var g_sprayGunAmmo = 9;
var g_tempSprayGunAmmo = 0;
// Sniper gun
var g_sniperGunB = false;
var g_sniperGunAmmo = 5;
var g_tempSniperGunAmmo = 0;
// Machine gun
var g_machineGunB = false;
var g_tempMachineGunAmmo = 0;
var g_machineGunAmmo = 20

// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 1;
Bullet.prototype.velY = 1;
Bullet.prototype.friendOrFoe = true;

Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);


    if (this.cy < 6){
      return entityManager.KILL_ME_NOW;
    }
    if (this.cy > canvas.height) {
      return entityManager.KILL_ME_NOW;
    }
    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);


    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();


    if (hitEntity) {
      if (hitEntity.friendOrFoe != this.friendOrFoe) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        return entityManager.KILL_ME_NOW;
      }
    }

    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();

    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

Bullet.prototype.render = function (ctx) {

    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};
