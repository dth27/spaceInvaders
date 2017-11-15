/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_rocks   : [],
_bullets : [],
_ships   : [],
_alienbullets : [],
_walls   : [],
_Lives   : [],


_bShowRocks : true,
// Keeps track of whether aliens should turn around or not.
_turnAliensNext : false,

// "PRIVATE" METHODS

_generateRocks : function() {
    var i,
        NUM_ROWS = 5,
		NUM_COLUMNS = 12,
		initialCX = 80,
		initialCY = 100,
		xInterval = 40,
		yInterval = 40;

    for (i = 0; i < NUM_ROWS; ++i) {
		for (var j = 0; j < NUM_COLUMNS; j++) {
			var nextCX = initialCX + (xInterval * j);
			var nextCY = initialCY + (yInterval * i);
			if(i > 0 && i < 3) this.generateRock({
								cx : nextCX,
								cy : nextCY,
								sprite : g_sprites.alien2});
			else if(i === 0) this.generateRock({
								cx : nextCX,
								cy : nextCY,
								sprite : g_sprites.alien3});
			else this.generateRock({
					cx : nextCX,
					cy : nextCY});
		}
    }
},
_generateWalls : function() {
  var i,
      NUM_ROWS = 3,
  NUM_COLUMNS = 3,
  initialCX = 15,
  initialCY = 400,
  xInterval = 30,
  yInterval = 20;

  for (i = 0; i < NUM_ROWS; ++i) {
  for (var j = 0; j < NUM_COLUMNS; j++) {
    var nextCX = initialCX + (xInterval * j);
    var nextCY = initialCY + (yInterval * i);
    this.generateWalls({
    cx : nextCX,
    cy : nextCY});

    this.generateWalls({
    cx : nextCX+200,
    cy : nextCY});

    this.generateWalls({
    cx : nextCX+400,
    cy : nextCY});
  }
}
},

_generateLives : function() {
  var i,
  NUM_LIVES = 3,
  initialCX = 20,
  xInterval = 40;
  for (i=0; i<NUM_LIVES; ++i){
    var nextCX = initialCX + (xInterval*i);
    this.generateLives({
      cx : nextCX,
      cy : g_canvas.height-20
    });
  }
},

_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY,
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// Tell all the aliens it's time to turn around
_turnAliensAround: function() {
	this._forEachOf(this._rocks, Rock.prototype.turnAround);
	this._turnAliensNext = false;
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// When aliens pass these X coordinates they need to
// turn around.
ALIEN_TURN_MAX : 580,
ALIEN_TURN_MIN : 20,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {

    this._categories = [this._rocks, this._bullets, this._ships, this._alienbullets, this._walls, this._Lives];

},

init: function() {
    this._generateRocks();

    this.generateEnemyShip({
        sprite: g_sprites.enemyship
    });

    //this._generateShip();
    this._generateWalls();
    this._generateLives();

},

fireBullet: function(cx, cy, velX, velY, rotation, forf) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        friendOrFoe : forf,
        rotation : rotation
    }));
},

fireEnemyBullet: function(cx, cy, velX, velY, rotation, forf) {
    this._alienbullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        friendOrFoe : forf,
        rotation : rotation
    }));
},

generateRock : function(descr) {
    this._rocks.push(new Rock(descr));
},

generateEnemyShip: function(descr) {
    this._ships.push(new EnemyShip(descr));
},

generateShip : function(descr) {
    this._ships.push(new SpaceShip(descr));
},
generateWalls : function(descr) {
      this._walls.push(new defenceWall(descr));

},

generateLives : function(descr) {
      this._Lives.push(new Lives(descr));
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

resetShips: function() {
    this._forEachOf(this._ships, SpaceShip.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, SpaceShip.prototype.halt);
},

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

// You guessed it, make the aliens turn around. More specifically:
// The entity manager notes that it's time to tell the aliens to turn around.
turnAliensNextUpdate: function() {
	this._turnAliensNext = true;
},

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

	if (this._turnAliensNext) this._turnAliensAround();

  if (this._rocks.length === 0) g_victory = true;
  if (this._ships[0].lifeSpann===0) g_lost = true;


},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks &&
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
