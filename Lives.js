"use strict";

function Lives(descr){
  this.setup(descr);
  this.rememberResets();
  this.sprite = this.sprite || g_sprites.ship;
  this.scale = 0.7;

};
Lives.prototype = new Entity();
Lives.prototype.rememberResets = function(){
  this.reset_cx = this.cx;
  this.reset_cy = this.cy;
  //g_lives = 3;
};

Lives.prototype.width = 20;
Lives.prototype.height = 10;

Lives.prototype.reset = function(){
  this.cx = this.reset_cx;
  this.cy = this.reset_cy;
  this._isDeadNow = false;
};
Lives.prototype.render = function(ctx) {
  var origScale = this.sprite.scale;
  this.sprite.scale = this.scale;
  this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, 0);
  this.sprite.scale = origScale;
};
Lives.prototype.update = function() {
  spatialManager.unregister(this);

  if (this._isDeadNow) {

  return entityManager.KILL_ME_NOW;
}
  spatialManager.register(this);
};
