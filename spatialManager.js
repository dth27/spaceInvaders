/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!
    this._nextSpatialID++;
    return this._nextSpatialID;

},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    var RegisterEntity = {entity: entity, posX: pos.posX, posY: pos.posY,
                        radius: entity.getRadius(), id: spatialID};

    //this._entities[spatialID] = entity;
    this._entities.push(RegisterEntity);

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    //if ()
    for(var ID in this._entities) {
        if (spatialID == this._entities[ID].id) {
            this._entities.splice(ID,1);
            //delete this._entities[spatialID];
        }
    }

    //delete this._entities[spatialID];

},

findEntityInRange: function(posX, posY, radius) {
    //var entityI;
    // TODO: YOUR STUFF HERE!
    for (var ID in this._entities)
    //for (var i=0; i<this._entities.length; i++)
          {
            var entityI = this._entities[ID];
            var entityX = entityI.posX;
            var entityY = entityI.posY;
            var entityR = entityI.radius;
            //console.log(entityX + " " + entityI.posX);

            if (util.distSq(entityX, entityY, posX, posY)
              < util.square(radius+entityR))
            {
              return entityI.entity;
            }
          }
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";

    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
