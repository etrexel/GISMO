
/*** Config ***/

// NOTE: board layout data currently comes from boardData.js and is stored in a variable called "board"

// canvas size in tiles
var tilesHorizontal = 120;
var tilesVertical = 80;

var TILE_SIZE = 8;

var separateTileInfo = {
	"0": "img/grass.png",
	"1": "img/tree.png",
	"2": "img/water.png",
	"3": "img/mountain.png",
	"blueBodyNormal": "img/blue_body_normal.png",
	"blueBodyOrtho": "img/blue_body_ortho.png",
	"blueTurretNormal": "img/blue_turret_normal.png",
	"blueTurretOrtho": "img/blue_turret_ortho.png",
	"redBodyNormal": "img/red_body_normal.png",
	"redBodyOrtho": "img/red_body_ortho.png",
	"redTurretNormal": "img/red_turret_normal.png",
	"redTurretOrtho": "img/red_turret_ortho.png",
	"blueBlockhouse": "img/blue_blockhouse.png",
	"redBlockhouse": "img/red_blockhouse.png",
	"smoke": "img/smoke.png"
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


/************/


// tile dimenstions of entire board
var boardW;
var boardH;

var minimapW;
var minimapH;

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

var game;
var board;
function initBoard(gameRef) {
	game = gameRef;
	board = game.battlefield.battlefield;
	boardW = board[0].length;
	boardH = board.length;

	minimapW = 150;
	minimapH = minimapW / boardW * boardH;

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
	
	for (var id in separateTileImages)
		separateTileImages[id].src = separateTileInfo[id];
		
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
	
	// transform ctx
	ctx.translate(-cameraX, -cameraY);
	ctx.scale(zoom, zoom);
	
	for (var y=0; y<bottom-top; y++) {
		for (var x=0; x<right-left; x++) {		
			var tile = board[y+top][x+left];
			
			// draw terrain
			var terrain = tile.terrain.getType(); 
			var singleTileImg = separateTileImages[terrain.toString()];
			ctx.drawImage(singleTileImg, (x+left)*TILE_SIZE, (y+top)*TILE_SIZE);
			// draw unit
			var unit = tile.getUnit();
			if (unit) {
				if (unit.getType() == "Blockhouse") {
					var color;
					if (unit.getFaction() == game.battlefield.faction1)
						color = "red";
					else
						color = "blue";
					
					var blockhouseImage = separateTileImages[color+"Blockhouse"];			
					ctx.drawImage(blockhouseImage, (x+left)*TILE_SIZE, (y+top)*TILE_SIZE);
					
				} else if (unit.getType() == "Tank") {
					//console.log("Drawing tank at ("+(x+left).toString()+", "+(y+top).toString()+")");
				
					var heading = unit.getHeading();
					var turret = unit.getTurret();
					
					var mapping = {
						"N": ["Normal", 0],
						"E": ["Normal", 90],
						"S": ["Normal", 180],
						"W": ["Normal", 270],
						"NE": ["Ortho", 0],
						"SE": ["Ortho", 90],
						"SW": ["Ortho", 180],
						"NW": ["Ortho", 270]
					};
										
					var color;
					if (unit.getFaction() == game.battlefield.faction1)
						color = "red";
					else
						color = "blue";					
					
					ctx.save();
					ctx.translate((x+left+0.5)*TILE_SIZE, (y+top+0.5)*TILE_SIZE);
					
					// draw body
					var bodyMapping = mapping[heading];
					var bodyImage = separateTileImages[color+"Body"+bodyMapping[0]];
					var bodyRotation = bodyMapping[1];
					
					ctx.rotate(Math.PI/180*bodyRotation);
					ctx.drawImage(bodyImage, (-0.5)*TILE_SIZE, (-0.5)*TILE_SIZE);
					ctx.rotate(-Math.PI/180*bodyRotation);
						
					// draw turret
					var turretMapping = mapping[turret];
					var turretImage = separateTileImages[color+"Turret"+turretMapping[0]];
					var turretRotation = turretMapping[1];
					
					ctx.rotate(Math.PI/180*turretRotation);
					ctx.drawImage(turretImage, (-0.5)*TILE_SIZE, (-0.5)*TILE_SIZE);
					ctx.rotate(-Math.PI/180*turretRotation);
					
					ctx.restore();
				}
			}
			
			// draw smoke
			if (tile.hasSmoke()) {
				var smokeImg = separateTileImages["smoke"];			
				ctx.drawImage(smokeImg, (x+left)*TILE_SIZE, (y+top)*TILE_SIZE);
			}
		}
	}
	
	// undo transforms (faster than restoring)
	ctx.scale(1/zoom, 1/zoom);
	ctx.translate(cameraX, cameraY);
	
	
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

