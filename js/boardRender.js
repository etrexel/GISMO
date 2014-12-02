
/*** Config ***/

// NOTE: board layout data currently comes from boardData.js and is stored in a variable called "board"

// canvas size in tiles
var tilesHorizontal = 120;
var tilesVertical = 80;

var TILE_SIZE = 8;

var tileInfo = {
	"src": "img/terrain_small.png",
	"tiles": {
		"0": [0,0], // tile identifier and tile row,col position in image file
		"1": [0,1],
		"2": [0,2],
		"3": [0,3],
		"4": [0,4]
	}	
};

var separateTileInfo = {
	"0": "img/tiles/grass.png",
	"1": "img/tiles/tree.png",
	"2": "img/tiles/water.png",
	"3": "img/tiles/mountain.png",
	"4": "img/tiles/tank.png"
}

var separateTileImages = {}
for (var id in separateTileInfo) {
	var img = new Image();
	
	img.onload = function() {
		this.loaded = true;
		
		var ready = true;
		for (var id in separateTileImages) {
			if (!separateTileImages[id].loaded) {
				ready = false;
				break;
			}
		}
		if (ready)
			startRendering();
	};
	
	separateTileImages[id] = img;
}

var useSeparateTiles = true;


/************/


// tile dimenstions of entire board
var boardW = board[0].length;
var boardH = board.length;

var minimapW = 150;
var minimapH = minimapW / boardW * boardH;

// pixel dimensions of canvas
var canvasW = tilesHorizontal * TILE_SIZE;
var canvasH = tilesVertical * TILE_SIZE;

var tileImg = new Image();
tileImg.onload = startRendering;

var $canvas, canvas, ctx;
var $mapCanvas, mapCanvas, mapCtx;

var cameraMoving = false;
var mapMoving = false;
var mouseLastX;
var mouseLastY;

var cameraX = 0;
var cameraY = 0;

var zoom = 1;

var keys = {
	"left": false,
	"right": false,
	"up": false,
	"down": false
}

var rerender = false; // the board will be rerendered on the frame after this gets set to true

function initBoard() {	
	$canvas = $("#boardCanvas");
	canvas = $canvas[0];
	ctx = canvas.getContext('2d');	
	
	canvas.width = canvasW;
	canvas.height = canvasH;	
	
	// handle canvas pan start
	$canvas.mousedown(function(e) {
		var offset = $(this).offset(); 
			
		mouseLastX = e.pageX - offset.left;
		mouseLastY = e.pageY - offset.top;
		cameraMoving = true;			
	});	
		
	// handle canvas zoom
	$canvas.mousewheel(function(e) {
		var delta = e.deltaY * e.deltaFactor / 500;		
		
		var newZoom = zoom+delta;	
		newZoom = Math.min(newZoom, 3); // set a resonable max zoom
		newZoom = Math.round(newZoom*1000)/1000; // avoid floating point errors...
		
		if (boardW*TILE_SIZE*newZoom - canvasW < 0 || boardH*TILE_SIZE*newZoom - canvasH < 0) 			
			return; // can't zoom that far out, rendered area would be smaller than the canvas		
				
		var offset = $(this).offset(); 			
		var mouseX = e.pageX - offset.left;
		var mouseY = e.pageY - offset.top;	
		
		// adjust panning so mouse stays on the same spot on the board
		cameraX += (mouseX+cameraX) * (newZoom/zoom - 1);
		cameraY += (mouseY+cameraY) * (newZoom/zoom - 1);
		
		zoom = newZoom;
		
		constrainCamera();
	
		rerender = true;	
	});	
	
	if (!useSeparateTiles) {
		// load images then start rendering
		tileImg.src = tileInfo["src"];	
	} else {
		for (var id in separateTileImages) {
			separateTileImages[id].src = separateTileInfo[id];
		}	
	}
	
	/* Minimap */
	
	$mapCanvas = $("#mapCanvas");
	mapCanvas = $mapCanvas[0];
	mapCtx = mapCanvas.getContext('2d');
	
	mapCanvas.width = minimapW
	mapCanvas.height = minimapH;	
		
	// handle minimap pan start
	$mapCanvas.mousedown(function(e) {		
		minimapPan(e);
		mapMoving = true;
	});
	
	
	
	// handle canvas and minimap panning and releasing
	// attach mousemove and mouseup events to the whole window so you can drag outside of the canvas
	$(window).mousemove(function(e) {				
		
		if (cameraMoving) {
			var offset = $canvas.offset(); 	
			var mouseCurX = e.pageX - offset.left;
			var mouseCurY = e.pageY - offset.top;
			
			cameraX += mouseLastX - mouseCurX;
			cameraY += mouseLastY - mouseCurY;
			
			constrainCamera();
			
			mouseLastX = mouseCurX;
			mouseLastY = mouseCurY;
			
			rerender = true;
			
		} else if (mapMoving) {			
			minimapPan(e);
		}
		
	}).mouseup(function()  {		
		cameraMoving = false;
		mapMoving = false;
	});	
	
	
	
	// pan with keyboard	
	$(window).keydown(function(e) {
		if (e.keyCode == 37 || e.keyCode == 65) // left arrow or A
			keys["left"] = true
		else if (e.keyCode == 38 || e.keyCode == 87) // up arrow or W
			keys["up"] = true
		else if (e.keyCode == 39 || e.keyCode == 68) // right arrow or D
			keys["right"] = true
		else if (e.keyCode == 40 || e.keyCode == 83) // down arrow or S
			keys["down"] = true	
	}).keyup(function(e) {
		if (e.keyCode == 37 || e.keyCode == 65) // left arrow or A
			keys["left"] = false
		else if (e.keyCode == 38 || e.keyCode == 87) // up arrow or W
			keys["up"] = false
		else if (e.keyCode == 39 || e.keyCode == 68) // right arrow or D
			keys["right"] = false
		else if (e.keyCode == 40 || e.keyCode == 83) // down arrow or S
			keys["down"] = false	
	});
	
	
}

function minimapPan(e) {
	var offset = $mapCanvas.offset(); 	
	mouseLastX = e.pageX - offset.left;
	mouseLastY = e.pageY - offset.top;		

	var boardPxW = boardW*TILE_SIZE*zoom;
	var boardPxH = boardH*TILE_SIZE*zoom;	

	var oldCameraX = cameraX;
	var oldCameraY = cameraY;
	
	cameraX = (mouseLastX / minimapW) * boardPxW - canvasW / 2;
	cameraY = (mouseLastY / minimapH) * boardPxH - canvasH / 2;
	constrainCamera();
	
	if (cameraX != oldCameraX || cameraY != oldCameraY)
		rerender = true;	
}

function constrainCamera() {
	cameraX = Math.min(Math.max(cameraX, 0), boardW*TILE_SIZE*zoom - canvasW);
	cameraY = Math.min(Math.max(cameraY, 0), boardH*TILE_SIZE*zoom - canvasH);
	
	cameraX = Math.round(cameraX);
	cameraY = Math.round(cameraY);
}

// cross-browser requestAnimationFrame
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

function startRendering() {
	rerender = true;
	var lastFrameTime = new Date().getTime();
	(function animloop(){
		requestAnimFrame(animloop);
		
		var frameTime = new Date().getTime();
		
		var keyPanDist = (frameTime-lastFrameTime) / 2; // calculate pan distance based on framerate
		lastFrameTime = frameTime;
		
		var oldCameraX = cameraX;
		var oldCameraY = cameraY;
		if (keys["left"] && !keys["right"])
			cameraX -= keyPanDist;
		if (keys["right"] && !keys["left"])
			cameraX += keyPanDist;
		if (keys["up"] && !keys["down"])
			cameraY -= keyPanDist;
		if (keys["down"] && !keys["up"])
			cameraY += keyPanDist;
		
		constrainCamera();
		
		if (cameraX != oldCameraX || cameraY != oldCameraY)
			rerender = true;			
		
		if (rerender) {
			render();
			rerender = false;
		}
	})();
}

function render() {	
	ctx.clearRect(0, 0, canvasW, canvasH);

	var ts = TILE_SIZE * zoom;
	
	var left = Math.floor(cameraX / ts);
	var right = Math.ceil((cameraX+canvasW) / ts);	
	
	var top = Math.floor(cameraY / ts);
	var bottom = Math.ceil((cameraY+canvasH) / ts);
	
	//console.log(top, bottom, left, right);
	
	// numbers are scaled up for this modulus to prevent floating point garbage
	var offsetX = - ((cameraX*10000) % (ts*10000)) / 10000;
	var offsetY = -((cameraY*10000) % (ts*10000)) / 10000;
	
	//console.log(offsetX, offsetY);
	
	for (var y=0; y<bottom-top; y++) {
		for (var x=0; x<right-left; x++) {		
			var tile = board[y+top][x+left].getTerrain().getType();		
		
			if (useSeparateTiles) {
				var singleTileImg = separateTileImages[tile.toString()];	
				ctx.drawImage(singleTileImg, x*ts+offsetX, y*ts+offsetY, ts, ts);
			} else {		
				var tileData = tileInfo["tiles"][tile.toString()];			
				ctx.drawImage(tileImg, tileData[1]*TILE_SIZE, tileData[0]*TILE_SIZE, TILE_SIZE, TILE_SIZE, x*ts+offsetX, y*ts+offsetY, ts, ts);
			}
		}
	}
	
	mapCtx.clearRect(0, 0, minimapW, minimapH);
	mapCtx.fillStyle = "#222222";
	mapCtx.fillRect(0, 0, minimapW, minimapH);
	mapCtx.fillStyle = "#bbbbbb";
	
	var boardPxW = boardW*TILE_SIZE*zoom;
	var boardPxH = boardH*TILE_SIZE*zoom;	
	
	var viewedAreaLeft = cameraX / boardPxW * minimapW;
	var viewedAreaTop =  cameraY / boardPxH * minimapH;
	var viewedAreaW = canvasW/boardPxW*minimapW;
	var viewedAreaH = canvasH/boardPxH*minimapH
	
	mapCtx.fillRect(viewedAreaLeft, viewedAreaTop, viewedAreaW, viewedAreaH);
}

