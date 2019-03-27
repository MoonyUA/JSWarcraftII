// @Core
function CEntity(classname) {
	this.class = classname;
	this.Draw = function(){
	}
	this.Update = function(){
	}
}

function CApplication() {
	this.currentStage = new CStage();
	
	// DrawingLock is used to prevent additional Drawing before ending of previous call
	var m_drawingLock = false;
		
	//TODO: create complex "adult" game circle
	this.Frame = function(){
		if (!m_drawingLock)
		{
			m_drawingLock = true;
			this.Update();
			this.Draw();
			m_drawingLock = false;
		}
	}
	
	this.Run = function(){
		this.Initialize();
		window.setInterval(function(){ g_application.Frame() }, 1000/g_config.gameCircleFrequency);
	}

	this.Initialize = function(){
		// edit data.js in order to change game content
		InitializeGameData();
	}
	
	this.Draw = function(){
		g_ctx.fillRect(0, 0, g_canvas.width, g_canvas.height);	
		this.currentStage.Draw();
		g_player.Draw();
		// Render current backbuffer and start to draw in new one
		g_canvas.SwapBuffers();
	}
	this.Update = function(){
		this.currentStage.Update();
		g_player.Update();
		g_mouse.ResetMouseEvents();
	}
}

// @Map
function CTile(tile,x,y){
	this.tile = tile;
	
	// Determine if file is passable or not
	this.passable = false;
	if (((tile >= 4*19+12) && (tile <= 5*19+6)) ||
		((tile >= 9*19+9) && (tile <= 11*19+8)) ||
		((tile >= 11*19+11) && (tile <= 11*19+12)) ||
		((tile >= 11*19+13) && (tile <= 11*19+15)) ||
		((tile >= 12*19+1) && (tile <= 12*19+3)) ||
		((tile >= 12*19+8) && (tile <= 15*19+14)) || 
		(tile >= 17*19+11)) {
			this.passable = true;
	}
	this.x = x;
	this.y = y;
	
	// Tile can be temporary not passable - for example due to unit occupation
	this.temporaryPassable = true;
	
	this.IsPassable = function() {
		return this.passable && this.temporaryPassable;
	}
}

function CMap(sizex,sizey){
	this.map = [];
	this.sizex = sizex;
	this.sizey = sizey;
	// tileset (change it to other in order to change setting)
	this.tileset = new CSpriteAnimation("Data/Tiles/forest.png");
	this.tileset.offsetX = 0;
	this.tileset.offsetY = 0;
	this.tileset.dX = 1;
	this.tileset.dY = 1;
	this.rowWidth = 19;
	this.Draw = function(camera) {
		// Draw each map cell in camera rectangle, including a little padding
		for (var i = camera.y-camera.padding; i < camera.y + camera.height + camera.padding; i++) 
			for (var j = camera.x-camera.padding; j < camera.x + camera.width + camera.padding; j++) {
				var cell = this.map[(camera.y+i)*sizex+(camera.x+j)];
				if (cell != undefined) {
					var rect = this.tileset.GetFrame(cell.tile%this.rowWidth,Math.floor(cell.tile/this.rowWidth));
					g_ctx.drawImage(this.tileset.image, rect.x, rect.y,rect.width,rect.height,j*32+176,i*32+15,32,32);	
				}
			}
	}
	this.IsPassable = function(x,y) {
		return this.GetTile(x,y).IsPassable();
	}
	// we can set only temporary passability
	this.SetPassable = function(rect,passable) {
		for (var i = 0; i <= rect.height; i++)
			for (var j = 0; j <= rect.width; j++)
				this.GetTile(rect.x+j,rect.y+i).temporaryPassable = passable;

	// used with g_config.debug_showPassableCells
	// Draws red transparent rectangles over nonpassable cells
	this.DrawPassableCells = function(camera) {
		for (var i = camera.y; i < camera.y + camera.height; i++) 
			for (var j = camera.x; j < camera.x + camera.width; j++) {
				if (!this.IsPassable(j,i)) {
					g_ctx.save();
					g_ctx.globalAlpha=0.3;
					g_ctx.fillStyle="red";
					// TODO: remove "magic numbers"
					g_ctx.fillRect((j-camera.x) * 32+176,(i-camera.y)*32+15,32,32);
					g_ctx.restore();
				}
			}
	}
	}
	this.GetTile = function(x,y) {
		return this.map[y*sizex + x];
	}
	this.SetTile = function(x,y,tileId) {
		this.map[y*this.sizex + x] = new CTile(tileId,x,y,this.tileset)
	}
	
	//fill basic map with grass tiles
	for (var i = 0; i < this.sizex; i++)
		for (var j = 0; j < this.sizey; j++)
			this.SetTile(j,i,19*18+14);
}

function CWorld(mapname) {
	if (mapname == undefined) {
		this.map = new CDefaultMap();
	}
	else
		this.map = LoadMap(mapname);
	this.entities = [];
	this.decals = [];
	
	// Helps to find units, that are placed in specific rect (use World Coords)
	this.FindUnitIntersection = function(rect) {
		var result = [];
		for (var i = 0; i < this.entities.length; i++) {
			var unitCoords = this.entities[i].coords;
			unitCoords.width = this.entities[i].unitType.scale.x-1;
			unitCoords.height = this.entities[i].unitType.scale.y-1;
			if (RectIntersection(unitCoords,rect)) {
				result.push(this.entities[i]);
			}
		}
		return result;
	}
}

// Work in progress...
function LoadMap(file) {
    /*var csvRequest = new Request({
		url:"Data/Maps/test.txt",
        onSuccess:function(response){
			alert(response);
        }
    }).send();*/
	return new CMap(16,16);
}

// @Render
function DrawFlipped(image, clipx, clipy, clipwidth, clipheight, x, y, width, height){
	//start from right edge of image
	clipx = clipx + clipwidth;
	//moving leftward draw vertical lines step-by-step
	for (var i = 0; i<clipwidth; i++)
		g_ctx.drawImage(image, clipx-i, clipy, 1,clipheight,x+i,y,1,height);
}

// Represents drawable part of the user screen
function CCanvas(width,height,buffersCount){
	this.buffers = [];
	this.currentBuffer = 0;
	this.buffersCount = buffersCount;
	this.width = width;
	this.height = height;
	// Create canvas html block which will be the game screen
	var div = document.getElementById("CCanvas");
	div.innerHTML += "<canvas height='"+height+"' width='"+width+"' id='screen'></canvas>";
	this.screen = document.getElementById('screen');
	// Center the screen in client area
	this.screen.style.top = (window.screen.availHeight-height)/2 + "px";
	this.screen.style.left = (window.screen.availWidth-width)/2 + "px";
	this.screen.style.visibility='visible';
	this.screenContext = document.getElementById('screen').getContext('2d');
	// "Allocate" back buffers
	var offset = 0; // used with "g_config.debug_showBackBuffers"
	for (var i = 1; i<=buffersCount; i++) {
		var name = "buffer"+i;
		div.innerHTML += "<canvas height='"+height+"' width='"+width+"' id='"+name+"'></canvas>";
		var canvas = document.getElementById(name);
		// if setted up - render backbuffers too, under the game screen
		if (g_config.debug_showBackBuffers) {
			offset = 64+(height+8)*i;
			canvas.style.visibility='visible';
		} else {
			canvas.style.visibility='hidden';
		}
		canvas.style.top = (window.screen.availHeight-height)/2+ offset + "px";
		canvas.style.left = (window.screen.availWidth-width)/2 + "px";
		
		this.buffers.push(canvas);
	}
	// select context of backbuffer to draw
	this.currentContext = this.buffers[this.currentBuffer].getContext('2d');
	// TODO: delete g_ctx, use g_canvas.GetContext() instead
	g_ctx = this.currentContext; 
	
	// Render backbuffer content to screen and select new backbuffer
	this.SwapBuffers = function() {
		this.screen = document.getElementById('screen');
		this.screenContext = this.screen.getContext('2d');
		this.screenContext.drawImage(this.buffers[this.currentBuffer], 0,0);
		this.currentBuffer++;
		if (this.currentBuffer == this.buffersCount)
			this.currentBuffer = 0;
		this.currentContext = this.buffers[this.currentBuffer].getContext('2d');
		g_ctx = this.currentContext;
	}

	this.GetContext = function() {
		return this.currentContext;
	}
	
	this.GetCanvas = function() {
		return this.screen;
	}
}

// @Animation
function CSpriteAnimation(path) {
	this.path = path;
	this.image = new Image();
	this.image.src = path;
	this.offsetX = 14;
	this.offsetY = 4;
	this.dX = 5;
	this.dY = 6;
	this.width = 32;
	this.height = 32;
	this.boundingPadding = 0;
	this.padding = {
		left : 0,
		top : 0,
		right : 0,
		bottom : 0
	};
	this.GetFrame = function(x,y) {
		var startX = this.offsetX+x*(this.dX+this.width);
		var startY = this.offsetY+y*(this.dY+this.height);
		var rect = {
			x : startX-this.padding.left,
			y : startY-this.padding.top,
			width : this.width+this.padding.left+this.padding.right,
			height : this.height+this.padding.top+this.padding.bottom,
			padding : this.padding
		};
		return rect;
	}
}

// basic animation (without frame changing)
function CIdleAnimation() {
	this.frameX = 0;
	this.frameY = 0;
	this.Frame = function() {}
}

// basic animation for unit actions
function CLinearAnimation(frameLimitY,frameStartY) {
	this.frameX = 0
	this.frameY = frameStartY;;
	this.counter = 0;
	this.period = 3;
	this.frameLimitY = frameLimitY;
	this.frameStartY = frameStartY;
	this.Frame = function() {
		this.counter++;
		if (this.counter >= this.period) {
				this.frameY++;
			if (this.frameY > this.frameStartY+this.frameLimitY) {
				this.frameY = this.frameStartY;
			}
			this.counter = 0;
		}
	}
}

// @Entities
// decals - ghost entities with short lifetime
function CDecalType(width,height,imagename) {
	this.representation = new CSpriteAnimation(imagename);
	this.width = width;
	this.height = height;
	// how long frames decal is alive
	this.lifeLength = 0;
}

function CDecal(x,y,decalType,animation) {
	this.__proto__ = new CEntity("CDecal");
	this.x = x;
	this.y = y;
	this.decalType = decalType;
	this.lifeTimer = 0;
	// set this value to false in order to delete decal in next update
	this.stillAlive = true;
	this.animation = animation;
	
	this.Draw = function() {
		if (this.stillAlive) {
			var rect = this.decalType.representation.GetFrame(this.animation.frameX,this.animation.frameY);
			var absoluteCoords = { 
				x : this.x - g_viewport.camera.x*g_viewport.cellSize + g_viewport.x,
				y : this.y - g_viewport.camera.y*g_viewport.cellSize + g_viewport.y
			}
			g_ctx.drawImage(this.decalType.representation.image, rect.x, rect.y, rect.width, rect.height, absoluteCoords.x, absoluteCoords.y, this.decalType.width, this.decalType.height);
		}
	}
	this.Update = function() {
		// count lifetime to destroying
		if (this.stillAlive) {
			this.animation.Frame();
			if (this.lifeTime >= this.decalType.lifeLength) {
				this.stillAlive = false;
			} else {
				this.lifeTime++;
			}
		}
	}
}

// @Widgets
function CWidget(x,y,width,height) {
	this.__proto__ = new CEntity("CWidget");
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.visible = true;
	this.GetRect = function() {
		return {
			x : x,
			y : y,
			width : width,
			height : height
		}
	}
	// coords from widget's left-top corner
	this.GetWidgetRelativeCoords = function(x,y) {
		return {
			x : x-this.x,
			y : y-this.y
		}
	}
	this.Draw = function(){
	}
	this.Update = function(){
	}
}

// Just image on the screen
function CImage(x,y,width,height,path) {
	this.__proto__ = new CWidget(x,y,width,height);
	this.path = path;
	this.image = new Image();
	this.image.src = path;
	this.Draw = function(){
		if (this.visible)
			g_ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
	}
	this.Update = function(){
		
	}
}

// Just image, that draws one frame of some animation list
function CSprite(x,y,width,height,src,frameX,frameY) {
	this.__proto__ = new CWidget(x,y,width,height);
	this.src = src;
	this.frameX = frameX;
	this.frameY = frameY;
	this.Draw = function(){
		if (this.visible) {
			var rect = src.GetFrame(this.frameX,this.frameY);
			g_ctx.drawImage(this.src.image,rect.x,rect.y,rect.width,rect.height,this.x,this.y,this.width,this.height);
		}
	}
}

// Simple text string on screen
function CStaticText(x,y,width,height,text,align,size)
{
	this.__proto__ = new CWidget(x,y,width,height);
	this.text = text;
	if (align != undefined)
		this.align = align;
	else
		this.align = "start";
	if (size != undefined)
		this.size = size;
	else
		this.size = 8;
	this.Draw = function(parentRect){
		g_ctx.save();
		g_ctx.textAlign=this.align; 
		// TODO: move this params to CStaticText properties
		g_ctx.fillStyle = "gold";
		g_ctx.font = this.size+"pt folkard";
		g_ctx.fillText(this.text, parentRect.x + x, parentRect.y + y);
		g_ctx.restore();
	}
	this.Update = function(){
		
	}
}

function CButton(x,y,width,height,path,caption,font,onClick) {
	this.__proto__ = new CWidget(x,y,width,height);
	this.path = path;
	this.image = new Image();
	this.image.src = path;
	this.caption = caption;
	this.font = font;
	this.onClick = onClick; // callback function, that is called after click in button space
	this.Draw = function(){
		// TODO: change it to custom text drawing
		g_ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
		//ctx.fillText(this.caption,this.x,this.y);
	}
	this.Update = function(){
		if (g_mouse.clicked) {
			// TODO: refactor, change it to CWidget.GetRect() and g_mouse.GetMouseRect()
			if (g_mouse.x > this.x && g_mouse.x < this.x + this.width &&
				g_mouse.y > this.y && g_mouse.y < this.y + this.height)
					this.onClick();
		}
	}
}

// @Input
function CMouse() {
	x = 0;
	y = 0;
	// left button clicked
	clicked = false;
	// right button clicked
	rclicked = false;
	// left button up
	lup = false;
	// left button down
	ldown = false;
	// right button up
	rup = false;
	// right button down
	rdown = false;
	
	document.addEventListener('mousemove', function(e){ 
		var rect = g_canvas.GetCanvas().getBoundingClientRect();
		g_mouse.x = (e.clientX) - rect.left; 
		g_mouse.y = (e.clientY) - rect.top;
	}, false);

	document.addEventListener('click', function(e){ 
		g_mouse.clicked = true;
	}, false);

	document.addEventListener('mouseup', function(e){ 
		if (e.button == 0) {
			g_mouse.lup = true;
		} else if (e.button == 2) {
			g_mouse.rup = true;
		}
	}, false);

	document.addEventListener('mousedown', function(e){ 
		if (e.button == 0) {
			g_mouse.ldown = true;
		} else if (e.button == 2) {
			g_mouse.rdown = true;
		}
	}, false);

	document.addEventListener('contextmenu', function(e){
		e.preventDefault();
		g_mouse.rclicked = true;
		return false;
	}, false);

	this.GetMouseRect = function() {
		return { x : this.x, y: this.y, width : 0, height : 0 }
	}
	
	this.ResetMouseEvents = function() {
		this.clicked = false;
		this.rclicked = false;
		this.lup = false;
		this.ldown = false;
		this.rup = false;
		this.rdown = false;
	}
}

g_mouse = new CMouse();