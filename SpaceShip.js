
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


SpaceShip.prototype.update = function() {
  var nextCXleft = (this.cx - 10);
  var nextCXright = (this.cx + 10);
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

  this.fireBullet();
  spatialManager.register(this);

};


SpaceShip.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

SpaceShip.prototype.fireBullet = function() {
  if (keys[this.KEY_FIRE]){

    var launchDist = this.getRadius() * 1.2;

    var relVel = this.launchVel;
    var relVelX = this.cx* relVel;
    var relVelY =  this.cy*relVel;
    entityManager.fireBullet(
      this.cx , this.cy ,
      this.velX + relVelX, this.velY + relVelY,
      this.rotation
       );
  }
};

SpaceShip.prototype.reset = function(){
  this.setPos(this.reset_cx, this.reset_cy);
  this.rotation = this.reset_rotation;

};

SpaceShip.prototype.takeBulletHit = function(){
  //handle loss of life
};

SpaceShip.prototype.render = function(ctx){
  var origScale = this.sprite.scale;
  this.sprite.scale = this.scale;
  this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, this.rotation);
  this.sprite.scale = origScale;
};
