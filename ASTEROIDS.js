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

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
// ====================
// MUSIC
// ====================

var song = new Audio("sounds/game2.mp3");
function playSong(){
  song.play();
}

// ====================
// Scoring
// ====================
var score = 0;

function updateScoreBoard(ctx) {

  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "Bold 20px Arial";
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.fillText("Score: " + score, ctx.canvas.width-70, ctx.canvas.height-20);
  ctx.closePath();
}

// ====================
// Victory
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
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {

    entityManager.generateShip({
        cx : 300,
        cy : 500
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
    playSong();
    // Prevent perpetual firing!
    eatKey(SpaceShip.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS
var g_victory = false;
var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var g_enemyShip_goLeft = true;
var g_enemyShip_goRight = false;
var g_enemyShip_no = 0;

var g_score_enemies = 10;
var g_score_enemyship = 100;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');
var KEY_YES     = keyCode('Y')

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');
var KEY_L = keyCode('L');
function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_YES)) {
        entityManager._generateRocks();
        g_victory = false;
    }

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleRocks();
    if (eatKey(KEY_L)) entityManager.generateRock({
        sprite: g_sprites.alien
    });
    if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,

        sprite : g_sprites.ship});

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,

        sprite : g_sprites.ship2
        });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
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
    updateVictory(ctx);
    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        ship   : "images/spaceship.png",
        ship2  : "https://notendur.hi.is/~pk/308G/images/ship_2.png",
        rock   : "images/rock.png",
        alien  : "https://media.giphy.com/media/Qz9jVV6CiRSuI/giphy.gif",
        enemyship : "images/enemyship1.png",
        enemyship2 : "images/enemyship2.png",
        enemyship3 : "images/enemyship3.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.rock  = new Sprite(g_images.rock);
    g_sprites.alien  = new Sprite(g_images.alien);
    g_sprites.enemyship = new Sprite(g_images.enemyship);
    g_sprites.enemyship2 = new Sprite(g_images.enemyship2);
    g_sprites.enemyship3 = new Sprite(g_images.enemyship3);
    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;

    entityManager.init();
    createInitialShips();

    main.init();
}

// Kick it off
requestPreloads();
