//following comment lines are linter instructions
/* eslint-env browser*/
/*jslint browser: true*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var bkgrnd = document.getElementById("background");
var bgctx = bkgrnd.getContext("2d");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

bkgrnd.width = document.documentElement.clientWidth;
bkgrnd.height = document.documentElement.clientHeight;

ctx.imageSmoothingEnabled = false;
bgctx.imageSmoothingEnabled = false;



//store global game variables here
var game = {
    images: 0,
    imagesLoaded: 0,
    backgroundColor: '#ffffff',
    time: Date.now(),
    currentStage: "map"
};

//eliminates DOM errors by checking to see that all images are loaded
function imageLoaded() {
    "use strict";
    game.imagesLoaded += 1;
}

//are these necessary?
var tileMap = new Image();
tileMap.src = "rpgTileset.png";

var tileChicken = new Image();
tileChicken.src = "chickenx4.png";

//constructor for tileset image for sprites
function Tileset(image, tileWidth, tileHeight) {
    "use strict";
    /*jshint validthis: true */
    this.image = new Image();
    game.images += 1;
    this.image.onload = imageLoaded;
    this.image.src = image;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
}

//constructor for sprite's animation
function Animation(tileset, frames, frameDuration) {
    "use strict";
    /*jshint validthis: true */
    this.tileset = tileset;
    this.frames = frames;
    this.currentFrame = 0;
    this.frameTimer = Date.now();
    this.frameDuration = frameDuration;
}

//constructor for  the full sprite object
function Sprite(stateAnimations, startingState, x, y, width, height, speed) {
    "use strict";
    /*jshint validthis: true */
    this.stateAnimations = stateAnimations;
    this.currentState = startingState;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
}


function MapTileset(tileSize, mapRows, mapColumns, imageNumTiles, pixelMag, tileGrid) {
    "use strict";
    /* jshint validthis: true */
    //"this" explicitly allowed in constructor functions, which must start with capital letters
    //tileSizextileSize square tiles
    this.tileSize = tileSize;
    //this map is mapRows tiles tall
    this.mapRows = mapRows;
    //and mapColumns tiles wide
    this.mapColumns = mapColumns;
    //on the tileset image, there are imageNumTiles tiles per row
    this.imageNumTiles = imageNumTiles;
    //This is the number of times larger the tiles should appear
    this.pixelMag = pixelMag;
    //This is the gridded tile layout of the map
    this.tileGrid = tileGrid;
}

//Used to cycle the animations - not for framerate
function updateAnimation(anim) {
    "use strict";
    if (Date.now() - anim.frameTimer > anim.frameDuration) {
        if (anim.currentFrame < anim.frames.length - 1) {
            anim.currentFrame += 1;
        } else {
            anim.currentFrame = 0;
        }
        anim.frameTimer = Date.now();
    }
}

//Function to draw the CSS sprite - drawImage is a pain to use
function drawSprite(sprite, totalTileHeight, totalTileWidth) {
    "use strict";
    var spriteX, spriteY;
    if (sprite.currentState === 2 || sprite.currentState === 3) {
        //facing right or left, lock x but not y
        spriteY = sprite.y;
        spriteX = Math.round(sprite.x / totalTileWidth) * totalTileWidth;
    } else {
        //facing up or down, lock y but not x
        spriteY = Math.round(sprite.y / totalTileHeight) * totalTileHeight;
        spriteX = sprite.x;
    }
    ctx.drawImage(
        sprite.stateAnimations[sprite.currentState].tileset.image,
        sprite.stateAnimations[sprite.currentState].frames[sprite.stateAnimations[sprite.currentState].currentFrame].split(',')[0] * sprite.stateAnimations[sprite.currentState].tileset.tileWidth,
        sprite.stateAnimations[sprite.currentState].frames[sprite.stateAnimations[sprite.currentState].currentFrame].split(',')[1] * sprite.stateAnimations[sprite.currentState].tileset.tileHeight,
        sprite.stateAnimations[sprite.currentState].tileset.tileWidth,
        sprite.stateAnimations[sprite.currentState].tileset.tileHeight,
        spriteX,
        spriteY,
        sprite.width,
        sprite.height
    );
    updateAnimation(sprite.stateAnimations[sprite.currentState]);
}

//class variable definitions
var chickenTileset = new Tileset("chickenx4.png", 16, 16);
var chickenAnimationWalkLeft = new Animation(chickenTileset, ["0,0", "1,0", "2,0", "3,0", "4,0", "5,0", "6,0"], 250);
var chickenAnimationWalkRight = new Animation(chickenTileset, ["0,1", "1,1", "2,1", "3,1", "4,1", "5,1", "6,1"], 250);
var chickenAnimationWalkForward = new Animation(chickenTileset, ["0,2", "1,2", "2,2", "3,2", "4,2", "5,2", "6,2"], 250);
var chickenAnimationWalkBackward = new Animation(chickenTileset, ["0,3", "1,3", "2,3", "3,3", "4,3", "5,3", "6,3"], 250);
//sprite starting animation should be integer index of animations
var chickenSprite = new Sprite([chickenAnimationWalkLeft, chickenAnimationWalkRight, chickenAnimationWalkForward, chickenAnimationWalkBackward], 2, 0, 0, 96, 96, 750);

var mudmanTileset = new Tileset("mudman.png", 16, 16);
var mudmanAnimationWalkDown = new Animation(mudmanTileset, ["0,0", "1,0", "2,0", "3,0"], 350);
var mudmanAnimationWalkRight = new Animation(mudmanTileset, ["0,1", "1,1", "2,1", "3,1"], 350);
var mudmanAnimationWalkUp = new Animation(mudmanTileset, ["0,2", "1,2", "2,2", "3,2"], 350);
var mudmanAnimationWalkLeft = new Animation(mudmanTileset, ["0,3", "1,3", "2,3", "3,3"], 350);
var mudmanSprite = new Sprite([mudmanAnimationWalkRight, mudmanAnimationWalkLeft, mudmanAnimationWalkDown, mudmanAnimationWalkUp], 0, 96, 96, 96, 96, 750);

var firstMap = new MapTileset(16, 4, 7, 16, 6, [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 2, 0, 0, 0, 2, 0],
    [0, 0, 2, 2, 2, 0, 0]
]);
//assign to global object
game.currentMap = firstMap;

// Handle keyboard controls
var keysDown = {};

document.addEventListener("keydown", function (e) {
	"use strict";
    keysDown[e.keyCode] = true;
}, false);

document.addEventListener("keyup", function (e) {
	"use strict";
    delete keysDown[e.keyCode];
}, false);

function keyHandler(sprite, time_mod, areaHeight, areaWidth) {
    "use strict";
    var tileSize, targetX, targetY, maxX, maxY;
    tileSize = game.currentMap.tileSize * game.currentMap.pixelMag;
    maxX = game.currentMap.mapColumns * tileSize;
    maxY = game.currentMap.mapRows * tileSize;
    if (keysDown[39] === true) {
        //right
        sprite.currentState = 0;
        if (sprite.x < areaWidth - 1) {
            sprite.x = Math.min(sprite.x + sprite.speed * time_mod, maxX);
        }
    } else if (keysDown[37] === true) {
        //left
        sprite.currentState = 1;
        if (sprite.x > 0) {
            sprite.x = Math.max(sprite.x - sprite.speed * time_mod, 0);
        }
    } else if (keysDown[40] === true) {
        //down
        sprite.currentState = 2;
        if (sprite.y < areaHeight - 1) {
            sprite.y = Math.min(sprite.y + sprite.speed * time_mod, maxY);
        }
    } else if (keysDown[38] === true) {
        //up
        sprite.currentState = 3;
        if (sprite.y > 0) {
            sprite.y = Math.max(sprite.y - sprite.speed * time_mod, 0);
        }
    } else {
        //if keys are not pressed and sprite is not rectangularly centered, keep moving it along an axis
        if (sprite.currentState === 0) {
            //right
            targetX = Math.min(Math.ceil(sprite.x / tileSize) * tileSize, maxX);
            if (sprite.x < targetX - 10) {
                sprite.x += sprite.speed * time_mod;
            } else {
                sprite.x = targetX;
            }
        }
        if (sprite.currentState === 1) {
            //left
            targetX = Math.max(Math.floor(sprite.x / tileSize) * tileSize, 0);
            if (sprite.x > targetX + 10) {
                sprite.x -= sprite.speed * time_mod;
            } else {
                sprite.x = targetX;
            }
        }
        if (sprite.currentState === 2) {
            //down
            targetY = Math.min(Math.ceil(sprite.y / tileSize) * tileSize, maxY);
            if (sprite.y < targetY - 10) {
                sprite.y += sprite.speed * time_mod;
            } else {
                sprite.y = targetY;
            }
        }
        if (sprite.currentState === 3) {
            //up
            targetY = Math.max(Math.floor(sprite.y / tileSize) * tileSize, 0);
            if (sprite.y > targetY + 10) {
                sprite.y -= sprite.speed * time_mod;
            } else {
                sprite.y = targetY;
            }
        }
    }
}

function drawMap(map) {
    "use strict";
    var r, c, tile, tileRow, tileColumn;
    for (r = 0; r < map.mapRows; r += 1) {
        for (c = 0; c < map.mapColumns; c += 1) {
            tile = map.tileGrid[r][c];
            tileRow = Math.floor(tile / map.imageNumTiles);
            tileColumn = Math.floor(tile % map.imageNumTiles);
            bgctx.drawImage(tileMap, (tileColumn * map.tileSize), (tileRow * map.tileSize), map.tileSize, map.tileSize, map.pixelMag * (c * map.tileSize), map.pixelMag * (r * map.tileSize), map.pixelMag * map.tileSize, map.pixelMag * map.tileSize);
        }
    }
}

function gameLoop() {
    "use strict";
    var mapPixelsHeight, mapPixelsWidth, tileSize, timeMod;
    tileSize = game.currentMap.tileSize * game.currentMap.pixelMag;
    mapPixelsHeight = game.currentMap.mapRows * tileSize;
    mapPixelsWidth = game.currentMap.mapColumns * tileSize;
    timeMod = (Date.now() - game.time) / 1000;
    
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (game.currentStage) {
    case "map":
        drawMap(game.currentMap);
        //keyHandler(chickenSprite, timeMod, mapPixelsHeight, mapPixelsWidth);
        //drawSprite(chickenSprite, tileSize, tileSize);
        keyHandler(mudmanSprite, timeMod, mapPixelsHeight, mapPixelsWidth);
        drawSprite(mudmanSprite, tileSize, tileSize);
        break;
    case "menu":
        break;
    }
    game.time = Date.now();
    window.requestAnimationFrame(gameLoop);
}

//unsure why this is necessary, to be honest. 
//tileMap.onload = drawImage;

window.requestAnimationFrame(gameLoop);