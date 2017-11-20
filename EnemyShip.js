
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


function EnemyShip(descr) {
    this.setup(descr);
    this.rememberResets();

    this.sprite = this.sprite || g_sprites.enemyship;

    this._scale = 1;
};

EnemyShip.prototype = new Entity();
EnemyShip.prototype.rememberResets = function(){
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

EnemyShip.prototype.rotation = 0;
EnemyShip.prototype.cx = 1300;
EnemyShip.prototype.cy = 50;
EnemyShip.prototype.velX = 1;
EnemyShip.prototype.velY = 0;
EnemyShip.prototype.launchVel = 0;


EnemyShip.prototype.update = function() {

    var ENEMYSHIP_LATENCY = 400;

    spatialManager.unregister(this);

    if (this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    if (g_enemyShip_goLeft) {
        if (this.cx >= (0 - (this.getRadius()*2) - ENEMYSHIP_LATENCY) ) {
            this.cx = this.cx - 1.5;
        }
        else {
            g_enemyShip_goLeft = false;
            g_enemyShip_goRight = true;
        }
    }
    else if (g_enemyShip_goRight) {
        if (this.cx <= (g_canvas.width + (this.getRadius()*2) + ENEMYSHIP_LATENCY) ) {
            this.cx = this.cx + 1.5;
        }
        else {
            g_enemyShip_goRight = false;
            g_enemyShip_goLeft = true;
        }
    }

    spatialManager.register(this);
};


EnemyShip.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};


EnemyShip.prototype.reset = function(){
    g_enemyShip_no = 0;
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};


// HACKED-IN AUDIO (no preloading)
//Rock.prototype.splitSound = new Audio(
//  "sounds/rockSplit.ogg");
EnemyShip.prototype.killSound = new Audio(
    "sounds/laserSound.ogg");



EnemyShip.prototype.whatEnemyShipAmI = function () {
    if (this.sprite === g_sprites.enemyship2) return 3;
    else if (this.sprite === g_sprites.enemyship3) return 2;
    else return 1;
};


EnemyShip.prototype.takeBulletHit = function(){
    this.kill();
    this.killSound.play();

    // Handel guns
    gunHandler();

    //update score
    if(g_enemyShip_no == 0) {
        //update scoreboard with the scores that the first enemyship gives
        g_score += g_score_enemyships[0]
    }
    else if(g_enemyShip_no == 1) {
        //update scoreboard with the scores that the second enemyship gives
        g_score += g_score_enemyships[1]
    }
    else {
        //update scoreboard with the scores that the third enemyship gives
        g_score += g_score_enemyships[2]
    }


    //update what EnemyShip should be generated next
    g_enemyShip_no += 1;
    if(g_enemyShip_no > 2) {g_enemyShip_no = 0;}
    var enemyShips = [g_sprites.enemyship, g_sprites.enemyship3, g_sprites.enemyship2];

    //update in what direction the new EnemyShip starts
    g_enemyShip_goRight = false;
    g_enemyShip_goLeft = true;

    //generate new EnemyShip
    entityManager.generateEnemyShip({
        cx : 1200,
        cy : 50,

        sprite: enemyShips[g_enemyShip_no]
    });

};

EnemyShip.prototype.render = function(ctx){
    var origScale = this.sprite.scale;
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, this.rotation);
    this.sprite.scale = origScale;
};

//When EnemyShip is hit, these power-ups (random choice)
//is given to the player
function gunHandler(){

  var x = Math.floor((Math.random() * 3)+1);
  switch (x) {
    case 1:
      // Turn on sprayGun
      if (!g_sprayGunB) {
        g_sprayGunB = true;
        g_tempSprayGunAmmo = g_sprayGunAmmo;
      }
      break;
    case 2:
    // Turn on sniperGun
      if (!g_sniperGunB) {
        g_sniperGunB = true;
        g_tempSniperGunAmmo = g_sniperGunAmmo;
      }
      break;
    case 3:
      // Turn on machineGun
      if (!g_machineGunB) {
        g_machineGunB = true;
        g_tempMachineGunAmmo = g_machineGunAmmo
      }
      break;
  }

}
