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
var rows = 3;
var columns = 4;
defenceWall.prototype.width = 25;
defenceWall.prototype.height = 10;
defenceWall.prototype.TopMargin =400;
defenceWall.prototype.Padding = 1;


defenceWall.prototype.drawWall = function(ctx, cx, cy) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
            ctx.rect(cx, cy, this.width, this.height);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

};
defenceWall.prototype.getRadius = function () {
    return this.width/2;
};
defenceWall.prototype.takeBulletHit = function(){
  this.kill();
  
};
defenceWall.prototype.render = function(ctx){
    this.drawWall(ctx, this.cx, this.cy);
};
defenceWall.prototype.update = function (){
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    spatialManager.register(this);
};
