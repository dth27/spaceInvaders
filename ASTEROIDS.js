// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

var container = document.getElementById('starfield');
var starfield = new Starfield();
starfield.initialise(container);
starfield.start();
/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
// ====================
// MUSIC
// ====================

var song = new Audio("sounds/trancepluck.wav");

function playSong(songs){
  songs.play();
}

// ====================
// Scoring
// ====================

function updateScoreBoard(ctx) {

  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "Bold 20px Arial";
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.fillText("Score: " + g_score, ctx.canvas.width-70, ctx.canvas.height-20);
  ctx.closePath();
}

// ====================
// Levels
// ====================

function updateLevelBoard(ctx) {
  util.writeText(ctx, canvas.width/2, canvas.height-20, "red", "Level ", g_level+1);
}

// ====================
// Victory & GameOver
// ====================
function updateVictory(){
  if (g_victory) {

    ctx.font = "Bold 20px Arial";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.fillText("Victory",ctx.canvas.width-300, ctx.canvas.height-300);
    ctx.fillText("Press Y to continue",ctx.canvas.width-300, ctx.canvas.height-280);
    ctx.closePath;
  }
}



// ====================
// GAME OVER
// ====================
function updateGameOver() {
	if (g_gameOver) {

		ctx.font = "Bold 20px Arial";
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.textAlign = "center";
		ctx.fillText("GAME OVER",ctx.canvas.width-300, ctx.canvas.height-300);
		var yourScore = "Your score was: " + g_score;
		ctx.fillText(yourScore, ctx.canvas.width / 2, ctx.canvas.height-280);
		ctx.fillText("Press Y to start a new game",ctx.canvas.width-300, ctx.canvas.height-260);
		ctx.closePath;
	}
}


// ====================
// CREATE INITIALS
// ====================

function createInitialShips() {

    entityManager.generateShip({
        cx : 300,
        cy : 500
    });

}

function createLives(){
  entityManager.generateLives({
    cx : 400,
    cy : 550
  });
  entityManager.generateLives({
    cx : 450,
    cy : 550
  });
  entityManager.generateLives({
    cx : 500,
    cy : 550
  });
}


// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);
    playSong(song);
    // Prevent perpetual firing!
    eatKey(SpaceShip.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS
var g_victory = false;
var g_gameOver = false;
var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var g_enemyShip_goLeft = true;
var g_enemyShip_goRight = false;
var g_enemyShip_no = 0;

var g_score = 0;
var g_score_enemies = 10;
var g_score_enemyships = [100, 200, 300];

var g_level = 0;

var KEY_MIXED   = keyCode('M');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');
var KEY_YES     = keyCode('Y');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');


function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_YES)) {
		if (g_victory) {
			g_level++;
			g_enemyShip_no = 0;
			entityManager.resetGame();
			g_victory = false;
		}

		else if(g_gameOver) {
			g_score = 0;
			g_level = 0;
			g_enemyShip_no = 0;
			entityManager.resetGame();
			g_gameOver = false;
		}
    }

    if (eatKey(KEY_RESET)) entityManager.resetShips();


}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);
    updateScoreBoard(ctx);
    updateLevelBoard(ctx);
    updateVictory(ctx);
    updateGameOver(ctx);
    if (g_renderSpatialDebug) spatialManager.render(ctx);


}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
    ship   : "images/spaceship.png",
    alien  : "images/alien.png",
	alien2 : "images/alien2.png",
	alien3 : "images/alien3.png",
	enemyship : "images/enemyship1.png",
    enemyship2 : "images/enemyship2.png",
    enemyship3 : "images/enemyship3.png",
    enemybullet : "images/alienShoot.png",
    spreadbullet : "images/spread.png",
    sniperbullet : "images/sniper.png"

    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.lives = new Sprite(g_images.ship);
    g_sprites.ship  = new Sprite(g_images.ship);

    g_sprites.alien  = new Sprite(g_images.alien, {
	width : 30,
	height : 20,
	spriteSheet : true});

	g_sprites.alien2 = new Sprite(g_images.alien2, {
	width : 25,
	height : 20,
	spriteSheet : true});

	g_sprites.alien3 = new Sprite(g_images.alien3, {
	width : 20,
	height : 20,
	spriteSheet : true});

    g_sprites.enemyship = new Sprite(g_images.enemyship);
    g_sprites.enemyship2 = new Sprite(g_images.enemyship2);
    g_sprites.enemyship3 = new Sprite(g_images.enemyship3);
    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;
    g_sprites.enemybullet = new Sprite(g_images.enemybullet);
    g_sprites.enemybullet.scale = 0.5;
    g_sprites.spreadbullet = new Sprite(g_images.spreadbullet);
    g_sprites.spreadbullet.scale = 0.6;
    g_sprites.sniperbullet = new Sprite(g_images.sniperbullet);
    g_sprites.sniperbullet.scale = 0.8;

    entityManager.init();
    createInitialShips();


    main.init();
}

// Kick it off
requestPreloads();
