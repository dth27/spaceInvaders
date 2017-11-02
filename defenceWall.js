"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

function defenceWall(descr){
  this.setup(descr);
  this.rememberResets();
};
defenceWall.prototype = new Entity();

defenceWall.prototype.rememberResets = function(){
  this.reset_width= this.width;
  this.reset_height = this.height;
};
var rows = 5;
var columns = 4;
defenceWall.prototype.width = 4;
defenceWall.prototype.height = 4;
defenceWall.prototype.cx;
defenceWall.prototype.cy;
var bricks = [];
var brickX, brickY;
for(var i=0; i<columns; i++) {
    bricks[i] = [];
    for(var j=0; j<rows; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1};
      }
};

defenceWall.prototype.drawWall = function(ctx) {
  for(var i=0; i<columns; i++) {
      for(var j=0; j<rows; j++) {
          if (bricks[i][j].status==1){
            brickX = (i*(this.width));
            brickY = (j*(this.eight));
            bricks[i][j].x = brickX;
            bricks[i][j].y = brickY;
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#fff";
            ctx.rect(brickX, brickY, this.width, this.height);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
          }
      }
  }
};
defenceWall.prototype.render = function(ctx){
    this.drawWall(ctx);
};
defenceWall.prototype.update = function (){
  //nei
}
