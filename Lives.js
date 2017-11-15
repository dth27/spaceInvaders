"use strict";

function Lives(descr){
  this.setup(descr);
  this.rememberResets();
};
Lives.prototype = new Entity();
Lives.prototype.rememberResets = function(){
  this.reset_cx = this.cx;
  this.reset_cy = this.cy;
};

Lives.prototype.width = 20;
Lives.prototype.height = 10;

Lives.prototype.drawLives = function(ctx, cx, cy){
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "yellow";
  ctx.fillStyle = "yellow";
  ctx.rect(cx, cy, this.width, this.height);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};
Lives.prototype.reset = function(){
  this.cx = this.reset_cx;
  this.cy = this.reset_cy;
  this._isDeadNow = false;
};
Lives.prototype.render = function(ctx) {
  this.drawLives(ctx, this.cx, this.cy);
};
Lives.prototype.update = function() {
  spatialManager.unregister(this);
  if (this._isDeadNow) return entityManager.KILL_ME_NOW;
  spatialManager.register(this);
};
