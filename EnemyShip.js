
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

//EnemyShip.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
//EnemyShip.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
//EnemyShip.prototype.KEY_FIRE   = ' '.charCodeAt(0);
EnemyShip.prototype.rotation = 0;
//TODO: breyta þessu tilbaka í 600 og nota aðra aðferð við að seinka innkomu óvinageimskipsins?
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
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
};


// HACKED-IN AUDIO (no preloading)
//Rock.prototype.splitSound = new Audio(
//  "sounds/rockSplit.ogg");
EnemyShip.prototype.killSound = new Audio(
    "sounds/laserSound.ogg");


EnemyShip.prototype.takeBulletHit = function(){
    this.kill();
    this.killSound.play();

    // turn on sprayGun
    if (!g_sprayGunB) {
      g_sprayGunB = true;
      g_tempSprayGunAmmo = g_sprayGunAmmo;
    }

    //update score
    score += g_score_enemyship;

    //update the scoring for enemyship (starting at 100 point, goes up 100 point for each new enemyship)
    g_score_enemyship += 100;

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
