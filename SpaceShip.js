
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


function SpaceShip(descr) {
  this.setup(descr);
  this.rememberResets();

  this.sprite = this.sprite || g_sprites.ship;

  this._scale = 1;
};

SpaceShip.prototype = new Entity();
SpaceShip.prototype.rememberResets = function(){
  this.reset_cx = this.cx;
  this.reset_cy = this.cy;
  this.reset_rotation = this.rotation;
};

SpaceShip.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
SpaceShip.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
SpaceShip.prototype.KEY_FIRE   = ' '.charCodeAt(0);
SpaceShip.prototype.rotation = 0;
SpaceShip.prototype.cx = 100;
SpaceShip.prototype.cy = 200;
SpaceShip.prototype.velX = 0;
SpaceShip.prototype.velY = 0;
SpaceShip.prototype.launchVel = 2;
SpaceShip.prototype.friendOrFoe = false;


SpaceShip.prototype.update = function() {
  var nextCXleft = (this.cx - 5);
  var nextCXright = (this.cx + 5);
  spatialManager.unregister(this);
  if (this._isDeadNow){
    return -1;
  }

 if (keys[this.KEY_LEFT]) {
    if (nextCXleft > 0 ) {
      this.cx = nextCXleft;
    }
  }
  else if (keys[this.KEY_RIGHT]) {
    if (nextCXright < g_canvas.width) {
      this.cx = nextCXright;
    }
  }

  this.SpaceShipfireBullet();
  spatialManager.register(this);

};


SpaceShip.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

SpaceShip.prototype.SpaceShipfireBullet = function() {
  if (keys[this.KEY_FIRE]) {
    if (TEMPALIENMAGAZINE < ALIENMAGAZINE ) {
      TEMPALIENMAGAZINE++;
    }
    if (entityManager._bullets.length < MAGAZINE+g_tempMachineGunAmmo && !g_sniperGunB && !g_sprayGunB) {

     var dX = +Math.sin(this.rotation)  ;
     var dY = -Math.cos(this.rotation)  ;
     var launchDist = this.getRadius() * 1.2;

     var relVel = this.launchVel;
     var relVelX = dX * relVel;
     var relVelY = dY * relVel;

     entityManager.fireBullet(
        this.cx + dX * launchDist, this.cy + dY * launchDist,
        this.velX + relVelX, this.velY + relVelY,
        this.rotation,false);

    }
    this.fireFromSpecialGuns();
};

SpaceShip.prototype.reset = function(){
  this.setPos(this.reset_cx, this.reset_cy);
  this.rotation = this.reset_rotation;

};

SpaceShip.prototype.takeBulletHit = function(){
  this.reset();
};

SpaceShip.prototype.render = function(ctx){
  var origScale = this.sprite.scale;
  this.sprite.scale = this.scale;
  this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, this.rotation);
  this.sprite.scale = origScale;
};

SpaceShip.prototype.sniperGun = function(){
  var dX = +Math.sin(this.rotation)  ;
  var dY = -Math.cos(this.rotation)  ;
  var launchDist = this.getRadius() * 1.2;

  var relVel = this.launchVel+10;
  var relVelX = dX * relVel;
  var relVelY = dY * relVel;

  entityManager.fireSniperBullet(
     this.cx + dX * launchDist, this.cy + dY * launchDist,
     this.velX + relVelX, this.velY + relVelY,
     this.rotation,false);
};

SpaceShip.prototype.machineGun = function(){
  var dX = +Math.sin(this.rotation)  ;
  var dY = -Math.cos(this.rotation)  ;
  var launchDist = this.getRadius() * 1.2;

  var relVel = this.launchVel;
  var relVelX = dX * relVel;
  var relVelY = dY * relVel;

  entityManager.fireBullet(
     this.cx + dX * launchDist, this.cy + dY * launchDist,
     this.velX + relVelX, this.velY + relVelY,
     this.rotation,false);
};

SpaceShip.prototype.sprayGun = function(){
  var dX = +Math.sin(this.rotation)  ;
  var dY = -Math.cos(this.rotation)  ;
  var launchDist = this.getRadius() * 1.2;

  var relVel = this.launchVel + 2.5;
  var relVelX = dX * relVel;
  var relVelY = dY * relVel;

  entityManager.fireSpreadBullet(
     this.cx + dX * launchDist, this.cy + dY * launchDist,
     this.velX + relVelX, this.velY + relVelY,
     this.rotation,false);

  var dX = +Math.sin(this.rotation)  + 0.6;
  var dY = -Math.cos(this.rotation)  - 0.9;
  var launchDist = this.getRadius() * 1.2;

  var relVel = this.launchVel;
  var relVelX = dX * relVel;
  var relVelY = dY * relVel;

 entityManager.fireSpreadBullet(
     this.cx + dX * launchDist, this.cy + dY * launchDist,
     this.velX + relVelX, this.velY + relVelY,
     this.rotation,false);

 var dX = +Math.sin(this.rotation)  -0.9 ;
 var dY = -Math.cos(this.rotation)  -0.9;
 var launchDist = this.getRadius() * 1.2;

 var relVel = this.launchVel;
 var relVelX = dX * relVel;
 var relVelY = dY * relVel;

 entityManager.fireSpreadBullet(
    this.cx + dX * launchDist, this.cy + dY * launchDist,
    this.velX + relVelX, this.velY + relVelY,
    this.rotation,false);
  };
}


SpaceShip.prototype.fireFromSpecialGuns = function(){
  // =============
  // Spray gun
  // =============
  if (g_sprayGunB && g_tempSprayGunAmmo >= 3) {
    this.sprayGun();
    g_tempSprayGunAmmo -= 3;
  } else {
    g_sprayGunB = false;
    g_tempSprayGunAmmo = 0;
  }
  // ============
  // Sniper gun
  // ============
  if (g_sniperGunB && g_tempSniperGunAmmo >= 0) {
    this.sniperGun();
    g_tempSniperGunAmmo -= 1;
  } else {
      g_sniperGunB = false;
      g_tempSniperGunAmmo = 0;
  }
  // ===========
  // Machine gun
  // ===========
  if (g_machineGunB && g_tempMachineGunAmmo >= 0) {
    this.machineGun();
    g_tempMachineGunAmmo -= 1;
  } else {
      g_machineGunB = false;
      g_tempMachineGunAmmo = 0;
  }
};
