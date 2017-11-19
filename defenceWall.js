"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

function defenceWall(descr){
  this.setup(descr);
  this.rememberResets();
};
defenceWall.prototype = new Entity();

defenceWall.prototype.rememberResets = function(){
  this.reset_cx = this.cx;
  this.reset_cy = this.cy;
};
defenceWall.prototype.width = 25;
defenceWall.prototype.height = 10;
defenceWall.prototype.lifeSpann = 2;
defenceWall.prototype.alpha = 1;

defenceWall.prototype.drawWall = function(ctx, cx, cy) {
			ctx.save();
			ctx.beginPath();
			ctx.globalAlpha = this.alpha;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
            ctx.rect(cx - (this.width / 2), cy - (this.height) / 2, this.width, this.height);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
			ctx.restore();

};
defenceWall.prototype.getRadius = function () {
    return this.width/2;
};
defenceWall.prototype.takeBulletHit = function(){
  if (this.lifeSpann == 0) this.kill();
  else {

    this.fadeAway();}

};
defenceWall.prototype.fadeAway = function(){
  if (this.lifeSpann==1){
    this.alpha = 0.5;
  }
  if (this.lifeSpann==2){
    this.alpha = 0.75;
  }
  this.lifeSpann--;
}
defenceWall.prototype.render = function(ctx){
    this.drawWall(ctx, this.cx, this.cy);
};
defenceWall.prototype.update = function (){
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    spatialManager.register(this);
};
