function CViewport(x,y,width,height,mapname) {
	this.__proto__ = new CWidget(x,y,width,height);
	
	this.AddEntity = function(entity) {
		this.world.entities.push(entity);
		this.world.map.SetPassable(entity.GetWorldRect(),false);
	}
	
	g_viewport = this;
	this.world = new CWorld(mapname);
	// TODO: move entity list to Level data
	this.AddEntity(new CUnit(5,5,"peasant"));
    this.AddEntity(new CUnit(4,4,"grunt"));	
	this.AddEntity(new CUnit(6,6,"archer"));
	this.AddEntity(new CUnit(6,7,"footman"));
	this.AddEntity(new CUnit(8,8,"mage"));
	this.AddEntity(new CUnit(7,7,"knight"));
	this.AddEntity(new CUnit(10,10,"dwarf"));
	this.AddEntity(new CUnit(2,10,"peon"));
	this.AddEntity(new CUnit(11,11,"town_hall"));
	this.AddEntity(new CUnit(5,10,"ballista"));
	this.AddEntity(new CUnit(7,10,"catapult"));
	this.AddEntity(new CUnit(10,2,"death_knight"));
	this.AddEntity(new CUnit(10,7,"goblin"));
	this.AddEntity(new CUnit(10,5,"ogre"));
	this.AddEntity(new CUnit(2,7,"troll"));
	this.camera = { x : 0, y : 0, width : 14, height : 14, padding : 3 };
	this.counter = 0;
	this.cameraWaiting = 3;
	this.cellSize = 32;

	// rect of world space, covered with camera (with padding), in World Coords System
	this.GetCullingRect = function() {
		return {
			x : this.camera.x - this.camera.padding,
			y : this.camera.y - this.camera.padding,
			width : this.camera.width + this.camera.padding*2,
			height : this.camera.height + this.camera.padding*2
		}
	}
	
	// Translate viewport widget-related coords to World Coords System
	this.GetWorldCoords = function(viewport_x,viewport_y){
	return  { x : Math.floor(viewport_x/this.cellSize)+this.camera.x,
			  y : Math.floor(viewport_y/this.cellSize)+this.camera.y
			}
	}
	
	// Translate coords from World Coords System to widget-relative viewport coords
	this.GetViewportCoords = function(world_x,world_y){
	return  { x : (world_x-this.camera.x)*this.cellSize,
			  y : (world_y-this.camera.y)*this.cellSize
			}
	}
	
	// Translate viewport widget-related coords to absolute position in world (in pixels, not in cells)
	this.GetAbsoluteWorldCoords = function(viewport_x,viewport_y){
	return  { x : viewport_x+this.camera.x*this.cellSize,
			  y : viewport_y+this.camera.y*this.cellSize
			}
	}
	
	// Draw current Game World, as it is seen from current camera position
	this.Draw = function(){
		// Draw map tiless
		this.world.map.Draw(this.camera);
		// Draw all alive decals ( corpses, missiles, spell effects)
		for (var i = 0; i< this.world.decals.length; i++)
			this.world.decals[i].Draw(this);
		// Draw all entities (units, buildings, golden mine)
		for (var i = 0; i< this.world.entities.length; i++)
			this.world.entities[i].Draw(this);
		// Draw player-specific info (Cursor)
		g_player.currentPlayerAction.Draw(this);
		// Draw nonpassable cells (only in debug_showPassableCells mode) (see data.js)
		if (g_config.debug_showPassableCells) {
			this.world.map.DrawPassableCells(this.camera);
		}
	}
	
	// Update all entities in the world
	this.Update = function(){
		// Detect if mouse is located near canvas borders and move camera if so.
		var bCounterReset = true; // Counter is used for more slow camera movement
		if ((g_mouse.x <= 0) && (this.camera.x > 0)) { // left screen edge
			if (this.counter >= this.cameraWaiting) { this.camera.x--; } else { this.counter++; bCounterReset = false;  } } else
				if ((g_mouse.x >= 640) && ( this.camera.x+this.camera.width < this.world.map.sizex))  // right screen edge
					if (this.counter >= this.cameraWaiting) { this.camera.x++; } else { this.counter++; bCounterReset = false; }
		if ((g_mouse.y <= 0) && (this.camera.y > 0)) { // top edge
			if (this.counter >= this.cameraWaiting) { this.camera.y--; } else { this.counter++; bCounterReset = false; } } else
				if ((g_mouse.y >= 480) && ( this.camera.y+this.camera.height < this.world.map.sizey)) // bottom edge
					if (this.counter >= this.cameraWaiting) { this.camera.y++; } else { this.counter++; bCounterReset = false; }
		if (bCounterReset)
			this.counter = 0;
			
		// TODO: merge entities and decals in one list (inherit decals from entities)
		// Update logic of all entities (units, buildings, golden mine)
		for (var i = 0; i< this.world.entities.length; i++) {
			this.world.entities[i].Update(this);
		}
		// Update logic of all decals (corpses, missiles, spell effects)
		for (var i = 0; i< this.world.decals.length; i++) {
			this.world.decals[i].Update(this);
		}
		// Delete all "dead" decals
		for (var i = 0; i< this.world.decals.length; i++) {
			if (!this.world.decals[i].stillAlive)
				this.world.decals.splice(i,1);
		}
		
		// comparator predicate for unit sorting
		function unitDistanceCompare(a,b) {
			if (a.coords.y < b.coords.y)
				return -1;
			if (a.coords.y > b.coords.y)
				return 1;
			if (a.coords.y == b.coords.y) {
				if (a.coords.x < b.coords.x)
					return -1;
				if (a.coords.x > b.coords.x)
					return 1;
			}
			return 0;
		}
		
		// sort units from upward to downward in order to draw nearer units over farther
		this.world.entities.sort(unitDistanceCompare);
	}
}

// TODO: repair editor screen and viewport
// Work In Progress...
function CEditorViewport(x,y,width,height,mapname) {
	this.__proto__ = new CViewport(x,y,width,height,mapname);
	g_viewport = this;
	this.Draw = function(){
		this.world.Draw(this.camera);
	}
	this.Update = function(){
		var bCounterReset = true;
		if ((g_mouse.x <= 0) && (this.camera.x > 0)) {
			if (this.counter >= this.cameraWaiting) { this.camera.x--; } else { this.counter++; bCounterReset = false;  } } else
				if ((g_mouse.x >= 640) && ( this.camera.x+this.camera.width < this.world.sizex))
					if (this.counter >= this.cameraWaiting) { this.camera.x++; } else { this.counter++; bCounterReset = false; }
		if ((g_mouse.y <= 0) && (this.camera.y > 0)) {
			if (this.counter >= this.cameraWaiting) { this.camera.y--; } else { this.counter++; bCounterReset = false; } } else
				if ((g_mouse.y >= 480) && ( this.camera.y+this.camera.height < this.world.sizey))
					if (this.counter >= this.cameraWaiting) { this.camera.y++; } else { this.counter++; bCounterReset = false; }
		if (bCounterReset)
			this.counter = 0;
		if (g_mouse.clicked)
		{
			var viewport_x = g_mouse.x-this.x;
			var viewport_y = g_mouse.y-this.y;
			if ((viewport_x >= 0) && (viewport_x <= this.width) && (viewport_y >= 0) && (viewport_y <= this.height)) {
				var x = Math.floor(viewport_x/32)+this.camera.x;
				var y = Math.floor(viewport_y/32)+this.camera.y;
				this.world.SetTile(x,y,this.world.GetTile(x,y).tile+1);
			}
		}
		if (g_mouse.rclicked)
		{
			var viewport_x = g_mouse.x-this.x;
			var viewport_y = g_mouse.y-this.y;
			if ((viewport_x >= 0) && (viewport_x <= this.width) && (viewport_y >= 0) && (viewport_y <= this.height)) {
				var x = Math.floor(viewport_x/32)+this.camera.x;
				var y = Math.floor(viewport_y/32)+this.camera.y;
				this.world.SetTile(x,y,this.world.GetTile(x,y).tile-1);
			}
		}
	}
}

// Project-specific animation framechanging strategy.
// It is used for cursor "target" decal after left mouse click (mark is appearing and then disappearing in backwise order)
function CBackwardAnimation() {
	this.frameX = 3;
	this.frameY = 0;
	this.counter = 0;
	this.period = 0;
	this.backward = false;
	this.Frame = function() {
		if (this.counter >= this.period) {
			if (!this.backward)
				this.frameX--;
			if (this.backward)
				this.frameX++;
			if (this.frameX < 0) {
				this.frameX = 0;
				this.backward = true;
			}
			this.counter = 0;
		} else {
			this.counter++;
		}
	}
}

// Unit Type class that represents params, specific for all units of the same type
// We should prefer composition to inheritance, so isolate unit-specific traits in separate class is a good idea
// In addition, it allows us to realize Flyweight design pattern (keep only one instance of unit-specific info for each unit kind
function CUnitType(path,speed) {
	this.firstName = "";
	this.secondName = "";
	this.level = "";
	this.representation = new CSpriteAnimation(path);
	this.icon = g_resources["icons"];
	this.iconId = 0;
	this.iconInRow = 10;
	this.abilities = [];
	// Unit-type keeps the list of possible unit animations (with setted up frame-order)
	// We should only change specific unit animation by keyword, if we need to change it
	this.animations = [];
	this.animations["idle"] = new CIdleAnimation();
	this.maxHitPoints = 30;
	this.minDamage = 8;
	this.maxDamage = 10;
	this.attackSpeed = 12;
	this.reload = 12;
	this.armor = 0;
	this.range = 1;
	this.sight = 4;
	this.speed = speed;
	this.building = false;
	// Scale is using for big units, such as buildings, that holds more that one world cell
	this.scale = { x : 1, y : 1 };
	
	// Get animation descriptor by name (or "idle" if no such animation exists)
	this.GetAnimation = function(name) {
		if (this.animations[name] != undefined)
			return this.animations[name];
		else
			return this.animations["idle"];
	}
}

// This class represents concrete instance of unit with his own state
function CUnit(x,y,typename) {
	this.__proto__ = new CEntity("CUnit");
	// TODO: move frameX to animation (now it helps with direction)
	this.frameX = 0;
	// TODO: mirror images on sprite list. DrawMirrored function is too slow in browser
	this.mirrored = false;
	// TODO: change this.angle from number to enumeration (or named_constants/strings if no such mechanism exists in javascript)
	this.angle = 0;
	this.unitType = g_unitTypes[typename];
	this.hitPoints = this.unitType.maxHitPoints;
	this.animation = this.unitType.GetAnimation("idle");
	// Unit position in World Coords System
	this.coords = {x : x, y : y};
	// TODO: move building-specific traits to separate class
	if (this.unitType.speed == 0)
		this.action = new CBuildingIdleAction();
	else
		this.action = new CStayAction();
	// Phase is used for temporary unit drawing place, while it moves from one cell to another
	// From the Game's point-of-view unit is still in previous cell
	this.phase = { x : 0, y : 0};
	this.selected = false;
	// Get rectangle of unit in World Coords System (it will be a point if there is no scaling)
	this.GetWorldRect = function() {
		return {
			x : this.coords.x,
			y : this.coords.y,
			width : this.unitType.scale.x - 1,
			height : this.unitType.scale.y - 1
		}
	}
	// Call this function when unit gets any damage
	this.TakeDamage = function(amount) {
		this.hitPoints -= (amount + this.unitType.armor) ;
		// Unit cannot have more hits than his unit-type maximum amount
		if (this.hitPoints > this.unitType.maxHitPoints)
			this.hitPoints = this.unitType.maxHitPoints;
		// If unit has zero or less hits - he dies
		if (this.hitPoints <= 0) {
			// TODO: change it to unit removing and corpse decal creation
			alert ( "Unit died!");
		}
	}
	
	this.Draw = function(viewport){
		var rect = this.unitType.representation.GetFrame(this.frameX,this.animation.frameY);
		// Bounding padding is used for bigger green selection rectangles
		var boundingPadding = this.unitType.representation.boundingPadding;
		var viewport_x = this.coords.x - viewport.camera.x;
		var viewport_y = this.coords.y - viewport.camera.y;
		var cullingRect = viewport.GetCullingRect();
		// We draw unit only if he fits to camera culling rectangle
		if (RectIntersection(this.GetWorldRect,cullingRect)) {
			// Absolute World Position (in pixels) of unit. We use unit.phase param to represent temperate movement between cells
			var x = viewport_x*viewport.cellSize + viewport.x + this.phase.x;
			var y = viewport_y*viewport.cellSize + viewport.y + this.phase.y;
			// Draw green selection rectangle under unit if it is selected
			if (this.selected) {
				g_ctx.beginPath();
				g_ctx.lineWidth="1";
				g_ctx.strokeStyle="green";
				g_ctx.rect(x-boundingPadding,y-boundingPadding,this.unitType.scale.x*viewport.cellSize+2*boundingPadding,this.unitType.scale.y*viewport.cellSize+2*boundingPadding); 
				g_ctx.stroke();
			}
			// Draw mirrored image if angle >= 180 degrees, or just draw image in other cases
			if (this.mirrored) {
				DrawFlipped(this.unitType.representation.image, rect.x, rect.y,rect.width,rect.height,x-rect.padding.left,y-rect.padding.top,rect.width,rect.height);
			} else
				g_ctx.drawImage(this.unitType.representation.image, rect.x, rect.y,rect.width,rect.height,x-rect.padding.left,y-rect.padding.top,rect.width,rect.height);
		}
	}
		
	this.Update = function(viewport){
		// Perform unit's current action
		this.action.Do(this);
		
		// Calculate new frame for unit's current animation
		this.animation.Frame();
		
		// This ugly heuristic algorithm calculates whether we need to flip image (angle >= 180) or not
		if ( this.angle < 5 ) {
			this.frameX = this.angle;
			this.mirrored = false;
		} else {
			this.frameX = 8 - this.angle;
			this.mirrored = true;
		}
		
		// If phase of unit movement is more than cell width - completely move unit (change coords, set previous cell to passable and new to nonpassable)
		// TODO: change magic numbers
		if (this.phase.x >= 32) { g_viewport.world.map.SetPassable(this.GetWorldRect(),true); this.coords.x++; this.phase.x -= 32; } else
			if (this.phase.x <= -32) { g_viewport.world.map.SetPassable(this.GetWorldRect(),true); this.coords.x--; this.phase.x += 32; }
		if (this.phase.y >= 32) { g_viewport.world.map.SetPassable(this.GetWorldRect(),true); this.coords.y++; this.phase.y -= 32; } else
			if (this.phase.y <= -32) { g_viewport.world.map.SetPassable(this.GetWorldRect(),true); this.coords.y--; this.phase.y += 32; }
		g_viewport.world.map.SetPassable(this.GetWorldRect(),false);
	}
}

// Beautiful and short "unix-way" class for game cursor graphical representation
function CCursor() {
	this.representation = new CImage(0,0,26,32,"Data/orcs_cursor.png");
	this.x = 0;
	this.y = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	this.Draw = function() {
		g_ctx.drawImage(this.representation.image,this.x-this.offsetX,this.y-this.offsetY,this.representation.width,this.representation.height);
	}
	this.Update = function() {
		this.x = g_mouse.x;
		this.y = g_mouse.y;
		this.representation.x = this.x;
		this.representation.y = this.y;
	}
}

// This class containts player-specific params.
//If we would do multiplayer game (or even game with AI-managed other players) - we could use more than one instances of that class
function CPlayer() {
	this.selectedObjects = [];
	this.isBuildingSelected = false;
	// Player actions - State pattern, that declares player input meaning
	this.currentPlayerAction = new CIdlePlayerAction();
	this.cursor = new CCursor();
	this.resources = {
		gold : 1200,
		lumber : 700,
		oil : 1000,
		food : 7,
		max_food : 9
	}
	// Use it to clear list of objects, currently selected by player
	this.ClearSelection = function() {
		for (var i = 0; i < this.selectedObjects.length; i++) {
			this.selectedObjects[i].selected = false;
		}
		this.selectedObjects.length = 0;
	}
	this.Draw = function() {
		this.currentPlayerAction.Draw();
		this.cursor.Draw();
	}
	this.Update = function() {
		this.cursor.Update();
		this.currentPlayerAction.Update();
	}
	// Use if to add objects to list of objects, currently selected by this player
	this.Select = function(entity) {
		if (this.selectedObjects.length == 1)
			if (this.selectedObjects[0].unitType.building)
				this.ClearSelection();
		if (entity.unitType.building) 
			if ( this.selectedObjects.length != 0 )
				return;
		entity.selected = true;
		this.selectedObjects.push(entity);
	}
}

// It's an abstract parent class for any unit ability
function CAbility(iconId,position) {
	this.icon = g_resources["icons"];
	this.iconId = iconId;
	this.iconInRow = 10;
	this.position = position;
	// Called, when player clicks to ability icons
	this.OnActivate = function(entity) {
	}
}

function CMoveAbility() {
	this.__proto__ = new CAbility(83);
	// Stop current units action, then force player to select target cell (set CMoveAction as action after target selecting)
	this.OnActivate = function(entity) {
		g_player.currentPlayerAction.End();
		g_player.currentPlayerAction = new CTargetPlayerAction(entity,new CMoveAction(0,0));
		g_player.currentPlayerAction.Start();
	}
}

function CAttackAbility() {
	this.__proto__ = new CAbility(116);
	// Stop current units action, then force player to select target cell (set CAttackAction as action after target selecting)
	this.OnActivate = function(entity) {
		g_player.currentPlayerAction.End();
		g_player.currentPlayerAction = new CTargetPlayerAction(entity,new CAttackAction(0,0));
		g_player.currentPlayerAction.Start();
	}
}

function CAction(name) {
	this.name = name;
	// Called, when unit stats to perform this action
	this.Start = function(entity) {
	}
	// Called each Update frame, while unit continues to perform this action
	this.Do = function(entity) {
	}
	// Called in the end of current action, usually before switching to another action
	this.End = function(entity) {
	}
}

// This action is used by buildings. Buildings usually are just staying.
function CBuildingIdleAction() {
	this.__proto__ = new CAction("CBuildingIdleAction");
	// yeah, do nothing... lazy buildings
}

// TODO: Implement CBuildingDevelopmentAction action for unit creation / tech development / upgrading to new building

// TODO: Implement CBuildingAttackAction for towers (without movement)

// This action is used by units, when they are trying to reach target cell
function CMoveAction(x,y) {
	this.__proto__ = new CAction("CMoveAction");
	// This is the target, that players select to move in
	this.target = {	x: x, y: y };
	// This is a container for future path (list of passable cells in right order)
	this.targetsList = [];
	// This is the next cell, that unit tries to reach
	this.nextUnitRect = { x: -1, y: -1, width : 0, height : 0};
	
	// We use modified A* algorithm of shortest path finding
	this.AStarRecount = function(unit) {
		var start = unit.coords;
		var end = this.target;
		// Open List for containing still unprocessed neighbour cells
		var openList = [];
		// Closed List for containing already processed cells
		var closedList = [];		 
		// Prepare Grid, 2D matrix of abstractions, that used by A* algo
		var grid = [];
		for(var x = 0; x < g_viewport.world.map.sizex; x++) {
			grid[x] = [];
			for(var y = 0; y < g_viewport.world.map.sizey; y++) {
				grid[x][y] = {};
				grid[x][y].f = 0;
				grid[x][y].g = 0; 
				grid[x][y].h = 0;
				grid[x][y].blocked = !(g_viewport.world.map.IsPassable(x,y));
				grid[x][y].parent = null;
				grid[x][y].x = x;
				grid[x][y].y = y;
			}
		}
		// Modification of algorithm. If we select nonpassable cell - we should find all it's passable neighbours (recursively)
		// We will find the shortest path to the nearest passable neighbour
		var targetPoints = [];																	// list for possible passable target cells
		targetPoints.push(this.target); 														// now we have only one possible target cell - our selected target
		for (var i = 0; i < targetPoints.length; i++) {
			if (grid[targetPoints[i].x][targetPoints[i].y].blocked) {							//... but if it is blocked...
				var neighbors = this.neighbors(grid, targetPoints[i]);							// ... we will search it's neighbours...
				for (var j = 0; j < neighbors.length; j++) {										
					if (targetPoints.indexOf(grid[neighbors[j].x][neighbors[j].y]) == -1)		// ... that are unprocessed yet ...
						targetPoints.push(grid[neighbors[j].x][neighbors[j].y]);				// ... to find possible candidates.
				}
			}																					// ...
		}
		for (var i = 0; i < targetPoints.length; i++) {											
			if (grid[targetPoints[i].x][targetPoints[i].y].blocked) {
				targetPoints.splice(i,1);														// ... and then - remove all blocked (nonpassable).
				--i;
			}
		}
		console.log(targetPoints);
		openList.push(grid[start.x][start.y]);													// now we can start (from "start" cell, of course)
		while(openList.length > 0) {
			var lowInd = 0;
			for(var i=0; i<openList.length; i++) {
				if(openList[i].f < openList[lowInd].f) { lowInd = i; }							// find the cell with least "f" value in Open List...
			}
			var currentNode = openList[lowInd];													// as a current node
 
			// End case -- result has been found, return the traced path to it
			if((currentNode.x == end.x) && (currentNode.y == end.y)) {				
				var curr = currentNode;															
				var ret = [];
				while(curr.parent) {
					ret.push(curr);
					curr = curr.parent;
				}
				return ret.reverse();
			}
			
			// Normal case -- move currentNode from open to closed, process each of its neighbors
			var index = openList.indexOf(currentNode);
			openList.splice(index, 1);
			closedList.push(currentNode);
			var neighbors = this.neighbors(grid, currentNode);
 
			for(var i=0; i<neighbors.length;i++) {
				var neighbor = neighbors[i];
				if((closedList.indexOf(neighbor) != -1) || (neighbor.blocked)) {
					// not a valid node to process, skip to next neighbor
					continue;
				}
 
				// g score is the shortest distance from start to current node, we need to check if
				//	 the path we have arrived at this neighbor is the shortest one we have seen yet
				if (PointDistance(currentNode,neighbor).length > 1)
					var gScore = currentNode.g + 1.01; 
				else
					var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
				var gScoreIsBest = false;
 
 
				if(openList.indexOf(neighbor) == -1) {
					// This the the first time we have arrived at this node, it must be the best
					// Also, we need to take the h (heuristic) score since we haven't done so yet
 
					gScoreIsBest = true;
					neighbor.h = GamePointDistance(neighbor, end).length;
					openList.push(neighbor);
				}
				else if(gScore < neighbor.g) {
					// We have already seen the node, but last time it had a worse g (distance from start)
					gScoreIsBest = true;
				}
 
				if(gScoreIsBest) {
					// Found an optimal (so far) path to this node.	 Store info on how we got here and
					//	just how good it really is...
					neighbor.parent = currentNode;
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;
				}
			}
			// after all - we should check whether we find any of our possible target nodes
			var everythingIsFound = true;
			var gScoreMinIndex = 0;
			for (var i = 0; i < targetPoints.length; i++) {
				var closedListIndex = closedList.indexOf(targetPoints[i]);
				if (closedListIndex == -1)									// no, still not every target node
					everythingIsFound = false;
				if (targetPoints[i].g < targetPoints[gScoreMinIndex].g)
					gScoreMinIndex = i;
			}
			
			// but if we already process any target nodes - then the node with the lowest g-score 
			// is our nearer node. Return path to it
			if (everythingIsFound) {
				
				var curr = targetPoints[gScoreMinIndex];
				var ret = [];
				while(curr.parent) {
					ret.push(curr);
					curr = curr.parent;
				}
				return ret.reverse();
			}
		}
	};
	
	// This function returns list of all existing nodes, that are close to argument node
	this.neighbors = function(grid, node) {
		var ret = [];
		var x = node.x;
		var y = node.y;
 
		if(grid[x-1] && grid[x-1][y]) {
			ret.push(grid[x-1][y]);
		}
		if(grid[x-1] && grid[x-1][y-1]) {
			ret.push(grid[x-1][y-1]);
		}
		if(grid[x] && grid[x][y-1]) {
			ret.push(grid[x][y-1]);
		}
		if(grid[x+1] && grid[x+1][y-1]) {
			ret.push(grid[x+1][y-1]);
		}
		if(grid[x+1] && grid[x+1][y]) {
			ret.push(grid[x+1][y]);
		}
		if(grid[x+1] && grid[x+1][y+1]) {
			ret.push(grid[x+1][y+1]);
		}
		if(grid[x] && grid[x][y+1]) {
			ret.push(grid[x][y+1]);
		}
		if(grid[x-1] && grid[x-1][y+1]) {
			ret.push(grid[x-1][y+1]);
		}
		return ret;
	}
	
	this.Start = function(unit) {
		unit.animation = unit.unitType.GetAnimation("movement");
		// calculate path with A* algorithm
		this.targetsList = this.AStarRecount(unit);
		// And get the first node in targetsList as the next step target
		if (this.targetsList.length >0)
			this.target = this.targetsList.shift();
		else
			this.End(unit);
	}
	this.Do = function(unit) {
		// Determine directions, in which we should move
		var dir = { lx : this.target.x < unit.coords.x,
					ly : this.target.y < unit.coords.y,
					mx : this.target.x > unit.coords.x,
					my : this.target.y > unit.coords.y
				}
		// Determine angle for animation purposes. Directions should help us
		if (dir.lx && dir.ly) unit.angle = 7; else
			if (dir.lx && !dir.ly && !dir.my) unit.angle = 6; else
				if (dir.lx && dir.my) unit.angle = 5; else
					if (!dir.lx && !dir.mx && dir.my) unit.angle = 4; else
						if (dir.mx && dir.my) unit.angle = 3; else
							if (dir.mx && !dir.ly && !dir.my) unit.angle = 2; else
								if (dir.mx && dir.ly) unit.angle = 1; else
									if (!dir.lx && !dir.mx && dir.ly) unit.angle = 0;

		// Update unit phase (position between two cells
		unit.phase.x = unit.phase.x + -1*unit.unitType.speed*dir.lx + unit.unitType.speed*dir.mx;
		unit.phase.y = unit.phase.y + -1*unit.unitType.speed*dir.ly + unit.unitType.speed*dir.my;
		
		// Determine next cell, that unit is going to occupy.
		var nextUnitPosRect = unit.GetWorldRect();
		nextUnitPosRect.x += dir.mx - dir.lx;
		nextUnitPosRect.y += dir.my - dir.ly;

		bIsPassable = true;
		if (g_viewport.world.map.IsPassable(nextUnitPosRect.x,nextUnitPosRect.y)) {				// If we can move to the next cell
			this.nextUnitRect = nextUnitPosRect;												// Then start moving there
			g_viewport.world.map.SetPassable(nextUnitPosRect,false);							// And set it as non-passable...
		}																						// ... 'cause we're really don't need concurrency
		if ((!g_viewport.world.map.IsPassable(nextUnitPosRect.x,nextUnitPosRect.y)) && !((nextUnitPosRect.x == this.nextUnitRect.x) && (nextUnitPosRect.y == this.nextUnitRect.y))) {
			// But if it is non-passable and it is not our target (non-passable due to our unit's movement) - stop.
			bIsPassable = false;
			unit.phase.x = 0;
			unit.phase.y = 0;
			// TODO: add recalculation of A* in this situation
		}
		if ((this.target.x == unit.coords.x) && (this.target.y == unit.coords.y) || !bIsPassable) {
		 //todo: change it to getters/setters
			if (this.targetsList.length > 0) {
				this.target = this.targetsList.shift();
			} else {
				this.End(unit);
				unit.action = new CStayAction();
				unit.action.Start(unit);
			}
		}
	}
	this.End = function(unit) {
		unit.animation = unit.unitType.GetAnimation("idle");
		if ((this.nextUnitRect.x != -1) && (this.textUnitRect != -1)) {
			g_viewport.world.map.SetPassable(this.nextUnitRect,true);
		}
	}
}

// Old version without pathfinding...
/*
function COldMoveAction(x,y) {
	this.__proto__ = new CAction("CMoveAction");
	this.target = {	x: x, y: y };
	this.nextUnitRect = { x: -1, y: -1, width : 0, height : 0};
	this.counter = 0;
	this.Start = function(unit) {
		if (unit.unitType.speed == 0)
		{
			unit.action = new CBuildingIdleAction();
			unit.action.Start(unit);	
		}
		unit.animation = unit.unitType.GetAnimation("movement");
	}
	this.Do = function(unit) {
		var dir = { lx : this.target.x < unit.coords.x,
					ly : this.target.y < unit.coords.y,
					mx : this.target.x > unit.coords.x,
					my : this.target.y > unit.coords.y
				}
		if (dir.lx && dir.ly) unit.angle = 7; else
			if (dir.lx && !dir.ly && !dir.my) unit.angle = 6; else
				if (dir.lx && dir.my) unit.angle = 5; else
					if (!dir.lx && !dir.mx && dir.my) unit.angle = 4; else
						if (dir.mx && dir.my) unit.angle = 3; else
							if (dir.mx && !dir.ly && !dir.my) unit.angle = 2; else
								if (dir.mx && dir.ly) unit.angle = 1; else
									if (!dir.lx && !dir.mx && dir.ly) unit.angle = 0;

		unit.phase.x = unit.phase.x + -1*unit.unitType.speed*dir.lx + unit.unitType.speed*dir.mx;
		unit.phase.y = unit.phase.y + -1*unit.unitType.speed*dir.ly + unit.unitType.speed*dir.my;
		
		var nextUnitPosRect = unit.GetWorldRect();
		nextUnitPosRect.x += dir.mx - dir.lx;
		nextUnitPosRect.y += dir.my - dir.ly;
		bIsPassable = true;
		if (g_viewport.world.map.IsPassable(nextUnitPosRect.x,nextUnitPosRect.y)) {
			this.nextUnitRect = nextUnitPosRect;
			g_viewport.world.map.SetPassable(nextUnitPosRect,false);
		}
		if ((!g_viewport.world.map.IsPassable(nextUnitPosRect.x,nextUnitPosRect.y)) && !((nextUnitPosRect.x == this.nextUnitRect.x) && (nextUnitPosRect.y == this.nextUnitRect.y))) {
			bIsPassable = false;
			unit.phase.x = 0;
			unit.phase.y = 0;
		}
		if ((this.target.x == unit.coords.x) && (this.target.y == unit.coords.y) || !bIsPassable) {
		 //todo: change it to getters/setters
			this.End(unit);
			unit.action = new CStayAction();
			unit.action.Start(unit);
		}
	}
	this.End = function(unit) {
		unit.animation = unit.unitType.GetAnimation("idle");
		if ((this.nextUnitRect.x != -1) && (this.textUnitRect != -1)) {
			g_viewport.world.map.SetPassable(this.nextUnitRect,true);
		}
	}
}*/

// This action is similar to Movement (but still without pathfinding), but has own logic when target is in range of it's attack
function CAttackAction(x,y) {
	this.__proto__ = new CAction("CAttackAction");
	this.target = {	x: x, y: y };
	this.targetUnit = undefined;
	this.nearTarget = false;
	this.counter = 0;
	this.Start = function(unit) {
		if (unit.unitType.speed == 0)
		{
			unit.action = new CBuildingIdleAction();
			unit.action.Start(unit);	
		}
		this.targetUnit = g_viewport.world.FindUnitIntersection(PointToRect(this.target))[0];
		if (this.targetUnit == undefined) {
			unit.action = new CMoveAction(this.target.x,this.target.y);
			unit.action.Start(unit);
		}
		unit.animation = unit.unitType.GetAnimation("movement");
	}
	this.Do = function(unit) {
		this.target = this.targetUnit.coords;
		
		var dir = { lx : this.target.x < unit.coords.x,
					ly : this.target.y < unit.coords.y,
					mx : this.target.x > unit.coords.x,
					my : this.target.y > unit.coords.y
				}
		if (dir.lx && dir.ly) unit.angle = 7; else
			if (dir.lx && !dir.ly && !dir.my) unit.angle = 6; else
				if (dir.lx && dir.my) unit.angle = 5; else
					if (!dir.lx && !dir.mx && dir.my) unit.angle = 4; else
						if (dir.mx && dir.my) unit.angle = 3; else
							if (dir.mx && !dir.ly && !dir.my) unit.angle = 2; else
								if (dir.mx && dir.ly) unit.angle = 1; else
									if (!dir.lx && !dir.mx && dir.ly) unit.angle = 0;
		
		// if unit can reach target unit with his attack
		if ( GamePointDistance(unit.coords, this.target).length <= unit.unitType.range )
		{
			// start attack, if it is not started yet
			if (!this.nearTarget) {
				this.nearTarget = true;
				unit.animation = unit.unitType.GetAnimation("attack");
			}
		} else {
			// stop attack and move
			if (this.nearTarget){
				this.nearTarget = false;
				unit.animation = unit.unitType.GetAnimation("movement");
			}
		// Just simple movement from here...
			//TODO: move all this code to separate algorithm, DRY
			unit.phase.x = unit.phase.x + -1*unit.unitType.speed*dir.lx + unit.unitType.speed*dir.mx;
			unit.phase.y = unit.phase.y + -1*unit.unitType.speed*dir.ly + unit.unitType.speed*dir.my;
		
			var nextUnitPosRect = unit.GetWorldRect();
			nextUnitPosRect.x += dir.mx - dir.lx;
			nextUnitPosRect.y += dir.my - dir.ly;
			bIsPassable = true;
			if (g_viewport.world.map.IsPassable(nextUnitPosRect.x,nextUnitPosRect.y)) {
				this.nextUnitRect = nextUnitPosRect;
				g_viewport.world.map.SetPassable(nextUnitPosRect,false);
			}
			if ((!g_viewport.world.map.IsPassable(nextUnitPosRect.x,nextUnitPosRect.y)) && !((nextUnitPosRect.x == this.nextUnitRect.x) && (nextUnitPosRect.y == this.nextUnitRect.y))) {
				bIsPassable = false;
				unit.phase.x = 0;
				unit.phase.y = 0;
			}
			if ((this.target.x == unit.coords.x) && (this.target.y == unit.coords.y) || !bIsPassable) {
			//todo: change it to getters/setters
				this.End(unit);
				unit.action = new CStayAction();
				unit.action.Start(unit);
			}
		}
	// ... to here
		// Attack logic
		if (this.nearTarget) {
			this.counter++;
			// Don't attack more frequently than unit's attack speed allows
			if (this.counter == unit.unitType.attackSpeed) {
				// Deal damage to target
				this.targetUnit.TakeDamage(GetRandomInt(unit.unitType.minDamage,unit.unitType.maxDamage));
				unit.animation = unit.unitType.GetAnimation("idle");
			}
			// After attack we should wait a little time to prepare to new one
			if (this.counter == unit.unitType.attackSpeed+unit.unitType.reload) {
				// start new attack frame
				this.counter = 0;
				unit.animation = unit.unitType.GetAnimation("attack");
			}

		}
	}
	this.End = function(unit) {
		unit.animation = unit.unitType.GetAnimation("idle");
	}
}

// Just don't perform anything, but rotate to 45 degrees time-to-time...
function CStayAction() {
	this.__proto__ = new CAction("CStayAction");
	this.counter = 0;
	this.nextRotationCounterLevel = 0;
	this.Start = function(unit) {
		unit.frameY = 0;
		this.nextRotationCounterLevel = GetRandomInt(100,300);
	}
	this.Do = function(unit){
		this.counter++;
		if (this.counter >= this.nextRotationCounterLevel) {
			unit.angle += GetRandomInt(-1,1);
			this.nextRotationCounterLevel = GetRandomInt(100,300);
			if (unit.angle == 8) unit.angle = 0; else
				if (unit.angle == -1) unit.angle = 7;
			this.counter = 0;
		}
	}
}

// Forces player to select target
function CTargetPlayerAction(unit,action){
	// unit that will perform selected action on selected target
	this.unit = unit;
	// action that will be performed by selected unit on selected target
	this.action = action; 
	this.Start = function() {
		g_player.cursor.representation = new CImage(g_player.cursor.x,g_player.cursor.y,33,33,"Data/orcs_target.png");
		this.offsetX = 16;
		this.offsetY = 16;
	}
	this.Draw = function() {
	}
	this.Update = function() {
		if (RectIntersection(g_mouse.GetMouseRect(),g_viewport.GetRect())) {
			if (g_mouse.clicked) {
				// Force selected unit to do selected action on selected target in World Coords
				var viewportCoords = g_viewport.GetWidgetRelativeCoords(g_mouse.x,g_mouse.y);
				this.action.target = g_viewport.GetWorldCoords(viewportCoords.x, viewportCoords.y);
				this.unit.action = this.action;
				this.unit.action.Start(this.unit);
				this.End();
			}
		}
		// Reset current player action if right-clicked
		if (g_mouse.rclicked)
		{
			this.End();
		}

	}
	this.End = function() {
		// Just return to normal player state - selection
		g_player.currentPlayerAction = new CSelectPlayerAction();
		g_player.cursor.representation = new CImage(g_player.cursor.x,g_player.cursor.y,26,32,"Data/orcs_cursor.png");
		this.offsetX = 0;
		this.offsetY = 0;
	}
}

function CIdlePlayerAction(){
	this.Start = function() {}
	this.Draw = function() {}
	this.Update = function() {}
	this.End = function() {}
}

function CSelectPlayerAction(){
	// Params of green big multiselection rectangle
	this.frame = { 
		enabled : false,
		x : 0,
		y : 0,
		width : 0,
		height : 0
	};
	this.Start = function() {
	}
	this.Draw = function() {
		// Draw big green multiselection rectangle
		if (this.frame.enabled) {
			g_ctx.beginPath();
			g_ctx.lineWidth="0";
			g_ctx.strokeStyle="green";
			g_ctx.rect(this.frame.x-g_viewport.camera.x*g_viewport.cellSize+g_viewport.x,this.frame.y-g_viewport.camera.y*g_viewport.cellSize+g_viewport.y,this.frame.width,this.frame.height); 
			g_ctx.stroke();
		}
	}
	this.Update = function() {
		if (RectIntersection(g_mouse.GetMouseRect(),g_viewport.GetRect())) {
			var viewportCoords = g_viewport.GetWidgetRelativeCoords(g_mouse.x,g_mouse.y);
			var absoluteWorldCoords = g_viewport.GetAbsoluteWorldCoords(viewportCoords.x,viewportCoords.y);
			absoluteWorldCoords.width = 0; absoluteWorldCoords.height = 0;
			var worldCoords = g_viewport.GetWorldCoords(viewportCoords.x,viewportCoords.y);
			worldCoords.width = 0;
			worldCoords.height = 0;
			var found = false;
			// Change cursor to loop if it is over selectable entity
			for (var i = 0; i< g_viewport.world.entities.length; i++){
				var unitCoords = g_viewport.world.entities[i].coords;
				unitCoords.width = g_viewport.world.entities[i].unitType.scale.x-1;
				unitCoords.height = g_viewport.world.entities[i].unitType.scale.y-1;
				if (RectIntersection(unitCoords,worldCoords)) {
					g_player.cursor.representation = new CImage(g_player.cursor.x,g_player.cursor.y,34,35,"Data/loop.png");
					g_player.cursor.offsetX = 6; g_player.cursor.offsetY = 6;
					// And if left-clicked - select this selectable entity
					if (g_mouse.clicked)
					{	
						g_player.ClearSelection();
						g_player.Select(g_viewport.world.entities[i]);
					}
					found = true;
				}
			}
			// if no unit is found under cursor - just make common cursor
			if (!found) {
				g_player.cursor.representation = new CImage(g_player.cursor.x,g_player.cursor.y,26,32,"Data/orcs_cursor.png");
				g_player.cursor.offsetX = 0; g_player.cursor.offsetY = 0;
				// And if left-clicked to empty space - just clear selection
				if (g_mouse.clicked)
					g_player.ClearSelection();
			}
			// if right-clicked - force each selected entity to perform MoveAction to target cell
			if (g_mouse.rclicked)
			{
				if (g_player.selectedObjects.length > 0) {
					if (g_player.selectedObjects[0].unitType.speed != 0){
						for (var i = 0; i < g_player.selectedObjects.length; i++) {
							// TODO: add attack action if it is enemy unit in this cell
							g_player.selectedObjects[i].action.End(g_player.selectedObjects[i]);
							g_player.selectedObjects[i].action = new CMoveAction(worldCoords.x,worldCoords.y);
							g_player.selectedObjects[i].action.Start(g_player.selectedObjects[i]);
						}
						// Draw movement target indicator (green "X"-mark)
						g_viewport.world.decals.push(new CDecal(absoluteWorldCoords.x-16,absoluteWorldCoords.y-16,g_decalTypes["target"],new CBackwardAnimation()));
					}
				}
			}
			// if we are selecting with frame now - update it's width and height according to current cursor position
			if (this.frame.enabled)
			{
				this.frame.width = viewportCoords.x+g_viewport.camera.x*g_viewport.cellSize-this.frame.x;
				this.frame.height = viewportCoords.y+g_viewport.camera.y*g_viewport.cellSize-this.frame.y;
			} 
			// if left mouse button is down - start to multiselect with frame
			if (g_mouse.ldown)
			{
				this.frame.enabled = true;
				this.frame.x = viewportCoords.x+g_viewport.camera.x*g_viewport.cellSize;
				this.frame.y = viewportCoords.y+g_viewport.camera.y*g_viewport.cellSize;
				this.frame.width = 0;
				this.frame.height = 0;
			}
			// if left mouse button is up and we were selecting with frame - add all intersected units to selection list
			if (g_mouse.lup)
			{
				if (this.frame.enabled)
				{
					this.frame.enabled = false;
					var rect = NormalizeRect(this.frame);
					var worldRect = { 	x : Math.floor(rect.x/g_viewport.cellSize),
										y : Math.floor(rect.y/g_viewport.cellSize),
										x2 : Math.floor((rect.x+rect.width)/g_viewport.cellSize),
										y2 : Math.floor((rect.y+rect.height)/g_viewport.cellSize)
									}
					g_player.ClearSelection();
					for (var i = 0; i < g_viewport.world.entities.length; i++)
					{
						var unitCoords = g_viewport.world.entities[i].coords;
						unitCoords.width = g_viewport.world.entities[i].unitType.scale.x-1;
						unitCoords.height = g_viewport.world.entities[i].unitType.scale.y-1;
						worldRect.width = worldRect.x2 - worldRect.x;
						worldRect.height = worldRect.y2 - worldRect.y;
						if (RectIntersection(unitCoords,worldRect)) {
							g_player.Select(g_viewport.world.entities[i]);
						}	
					}
				}
			}
		}
	}
	this.End = function() {
	}
}

// Widget, that shows 4 game resources of current player
function CResourceWidget(x,y,width,height)
{
	this.__proto__ = new CWidget(x,y,width,height);
	this.goldIndicator = new CStaticText(230,10,100,100,"");
	this.lumberIndicator = new CStaticText(303,10,100,100,"");
	this.oilIndicator = new CStaticText(376,10,100,100,"");
	this.foodIndicator = new CStaticText(449,10,100,100,"");
	
	this.Draw = function(){
		this.goldIndicator.Draw(this.GetRect());
		this.lumberIndicator.Draw(this.GetRect());
		this.oilIndicator.Draw(this.GetRect());
		this.foodIndicator.Draw(this.GetRect());		
	}
	this.Update = function(){
		this.goldIndicator.text = g_player.resources.gold;
		this.lumberIndicator.text = g_player.resources.lumber;
		this.oilIndicator.text = g_player.resources.oil;
		this.foodIndicator.text = g_player.resources.food+" / "+g_player.resources.max_food;
	}
}

// Widget, that shows info about one currently selected unit
function CUnitSingleSelectionWidget(x,y,width,height) {
	this.__proto__ = new CWidget(x,y,width,height);
	this.frame = new Image();
	this.frame.src = "Data/hud_left_bottom_top2.png";
	this.abilityFrame = new Image();
	this.abilityFrame.src = "Data/hud_left_bottom_top_multiselect_item.png";
	this.portrait = new CSprite(this.x+3,this.y+3,46,38,g_resources["icons"],7,8);
	this.abilityIcons = [];
	this.widgets = [];
	this.widgets.firstName = new CStaticText(105,18,0,0,"","center",12);
	this.widgets.secondName = new CStaticText(105,32,0,0,"","center",12);
	this.widgets.level = new CStaticText(105,48,0,0,"","center",12);
	this.widgets.health = new CStaticText(30,60,0,0,"","center",8);
	this.widgets.armor = new CStaticText(this.width/2,75,0,0,"","center",12);
	this.widgets.damage = new CStaticText(this.width/2,93,0,0,"","center",12);
	this.widgets.range = new CStaticText(this.width/2,111,0,0,"","center",12);
	this.widgets.sight = new CStaticText(this.width/2,129,0,0,"","center",12);
	this.widgets.speed = new CStaticText(this.width/2,147,0,0,"","center",12);
	this.selectedAbility = -1;
	this.mouseoverAbility = -1;
	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++)
			this.abilityIcons.push( new CSprite(9+56*j,340+47*i,46,38,g_resources["icons"],7,8));
	this.Draw = function(){
		if (this.visible) {
			g_ctx.drawImage(this.frame,this.x,this.y,this.width,this.height);
			this.portrait.Draw();
			for (var i=0; i < this.abilityIcons.length; i++) {
				if (this.abilityIcons[i].visible) {
					g_ctx.drawImage(this.abilityFrame,0,0,54,46,this.abilityIcons[i].x-4,this.abilityIcons[i].y-4,54,46);
					this.abilityIcons[i].Draw();
					// if mouse is over this ability - draw white selection frame
					if (this.mouseoverAbility == i) {
						g_ctx.beginPath();
						g_ctx.lineWidth="0";
						g_ctx.strokeStyle="white";
						g_ctx.rect(this.abilityIcons[i].x-5,this.abilityIcons[i].y-5,56,48);
						g_ctx.stroke();
					}
					// if ability is activated - draw green frame
					if (this.selectedAbility == i) {
						g_ctx.beginPath();
						g_ctx.lineWidth="0";
						g_ctx.strokeStyle="green";
						g_ctx.rect(this.abilityIcons[i].x+1,this.abilityIcons[i].y+1,44,36);
						g_ctx.stroke();
					} 
				}
			}
			this.widgets.firstName.Draw(this.GetRect());
			this.widgets.secondName.Draw(this.GetRect());
			this.widgets.level.Draw(this.GetRect());
			this.widgets.health.Draw(this.GetRect());
			this.widgets.armor.Draw(this.GetRect());
			this.widgets.damage.Draw(this.GetRect());
			this.widgets.range.Draw(this.GetRect());
			this.widgets.sight.Draw(this.GetRect());
			this.widgets.speed.Draw(this.GetRect());
		}
	}
	this.Update = function(){
		if (g_player.selectedObjects.length == 1) {
			// Update indicators for currently selected unit
			var unit = g_player.selectedObjects[0];
			this.widgets.firstName.text = unit.unitType.firstName;
			this.widgets.secondName.text = unit.unitType.secondName;
			this.widgets.level.text = unit.unitType.level;
			this.widgets.health.text = unit.hitPoints + "/" + unit.unitType.maxHitPoints;
			this.widgets.armor.text = "Armor: " + unit.unitType.armor;
			this.widgets.damage.text = "Damage: " + unit.unitType.minDamage+"-"+unit.unitType.maxDamage;
			this.widgets.range.text = "Range: " + unit.unitType.range;
			this.widgets.sight.text = "Sight: " + unit.unitType.sight;
			this.widgets.speed.text = "Speed: " + unit.unitType.speed;

			this.portrait.frameX = unit.unitType.iconId%unit.unitType.iconInRow;
			this.portrait.frameY = Math.floor(unit.unitType.iconId/unit.unitType.iconInRow);
			this.portrait.visible = true;
			for ( var i = 0; i < this.abilityIcons.length; i++)
			{
				if (i < unit.unitType.abilities.length) {
					this.abilityIcons[i].frameX = unit.unitType.abilities[i].iconId%unit.unitType.abilities[i].iconInRow;
					this.abilityIcons[i].frameY = Math.floor(unit.unitType.abilities[i].iconId/unit.unitType.abilities[i].iconInRow);
					this.abilityIcons[i].visible = true;
				} else {
					this.abilityIcons[i].visible = false;
				}
			}
			var mouseRect = {
				x : g_mouse.x,
				y : g_mouse.y,
				width : 0,
				height : 0
			}
			var widget_x = g_mouse.x-this.x;
			var widget_y = g_mouse.y-this.y;		
			this.selectedAbility = -1;
			this.mouseoverAbility = -1;						
			// determine, whether mouse is over current ability or not
			for (var i=0; i < this.abilityIcons.length; i++) {
				if (RectIntersection(this.abilityIcons[i].GetRect(),mouseRect)) {
					this.mouseoverAbility = i;
					if (g_mouse.clicked) {
						unit.unitType.abilities[i].OnActivate(unit);
					}
					if (g_mouse.ldown) {
						this.selectedAbility = i;
					}											
				}
			}
			this.visible = true;
		} else {
			for ( var i = 0; i < this.abilityIcons.length; i++)
				this.abilityIcons[i].visible = false;
			this.portrait.visible = false;
			this.visible = false;
		}
	}
}

// Widget, that represents info about several selected units
function CUnitMultiselectionWidget(x,y,width,height) {
	this.__proto__ = new CWidget(x,y,width,height);
	this.frame = new Image();
	this.frame.src = "Data/hud_left_bottom_top_multiselect_item.png";
	this.portraits = [];
	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++)
			this.portraits.push( new CSprite(5+56*j,165+53*i,46,38,g_resources["icons"],7,8));
	this.Draw = function(){
		if (this.visible) {
			// Draw all portraits
			for (var i=0; i < this.portraits.length; i++) {
				if (this.portraits[i].visible) {
					g_ctx.drawImage(this.frame,this.portraits[i].x-4,this.portraits[i].y-4,54,53);
					this.portraits[i].Draw();
				}
			}
		}
	}
	this.Update = function(){
		if ( g_player.selectedObjects.length >= 2 ) {
			// Update portraits icons
			for ( var i = 0; i < this.portraits.length; i++)
			{
				if ( i < g_player.selectedObjects.length ) {
					var unit = g_player.selectedObjects[i];
					this.portraits[i].frameX = unit.unitType.iconId%unit.unitType.iconInRow;
					this.portraits[i].frameY = Math.floor(unit.unitType.iconId/unit.unitType.iconInRow);
					this.portraits[i].visible = true;
				} else {
					this.portraits[i].visible = false;
				}
			}
			this.visible = true;
		} else {
			for ( var i = 0; i < this.portraits.length; i++)
				this.portraits[i].visible = false;
			this.visible = false;
		}
	}
}

// Some game screen or scene
function CStage() {
	this.widgets = [];
	this.Draw = function(){
		for (i = 0; i < this.widgets.length; i++) {
			this.widgets[i].Draw();
		}
	}
	this.Update = function(){
		for (i = 0; i < this.widgets.length; i++) {
			this.widgets[i].Update();
		}
	}
}

// Main menu screen
function CMainStage() {
	this.__proto__ = new CStage();
	this.widgets.push(new CImage(0,0,640,480,"Data/Menu_background.png"));
	this.widgets.push(new CButton(209,241,222,26,"Data/Menu_button_Single.png","","",function(){g_application.currentStage = new CGameStage()}));
	this.widgets.push(new CButton(209,277,222,26,"Data/Menu_button_Multiplayer.png","","",function(){g_application.currentStage = new CAnimationEditorStage()}));
	this.widgets.push(new CButton(209,313,222,26,"Data/Menu_button_Multiplayer.png","","",function(){g_application.currentStage = new CMapEditorStage()}));
	this.Draw = function(){
		this.__proto__.Draw();
	}
	this.Update = function(){
		this.__proto__.Update();
	}
}

// Game process screen
function CGameStage() {
	this.__proto__ = new CStage();
	this.widgets.push(new CViewport(177,16,448,448));
	this.widgets.push(new CImage(0, 0, 176, 25,"Data/hud_left_top.png"));
	this.widgets.push(new CImage(-1, 25, 23, 130,"Data/hud_left_left.png"));	
	this.widgets.push(new CImage(152, 25, 23, 130,"Data/hud_left_right.png"));	
	this.widgets.push(new CImage(0, 155, 176, 325,"Data/hud_left_bottom.png"));
	this.widgets.push(new CImage(176, 0, 464, 15, "Data/hud_right_top.png"));
	this.widgets.push(new CImage(176,465,464,15, "Data/hud_right_bottom.png"));
	this.widgets.push(new CImage(624,0,16,480,"Data/hud_right_right.png"));
	this.widgets.push(new CResourceWidget(0,0,0,0));
	var widget = new CUnitMultiselectionWidget(5, 168, 166, 163);
	widget.visible = false;
	this.widgets.push( widget );
	this.widgets.push(new CButton(25,3,124,17,"Data/game_button_menu.png","","",function(){g_application.currentStage = new CMainStage()}));
	widget = new CUnitSingleSelectionWidget(6,166,164,167);
	widget.visible = false;
	this.widgets.push(widget);
	g_player.currentPlayerAction = new CSelectPlayerAction();
	this.Draw = function(){
		this.__proto__.Draw();
	}
	this.Update = function(){
		this.__proto__.Update();
		
	}
}

function CAnimationEditorStage() {
	this.__proto__ = new CStage();
	this.widgets.push(new CImage(0, 0, 370, 624,"Data/Animations/alliance_footman.png"));
	this.rep = g_unitTypes["footman"].representation;
	this.Draw = function(){
		for (var i = 0; i<20; i++)	
			for (var j = 0; j<20; j++) {
				// draw 32x32 world coord cell
				g_ctx.beginPath();
				g_ctx.lineWidth="0";
				g_ctx.strokeStyle="blue";
				g_ctx.rect(this.rep.offsetX+j*(this.rep.width+this.rep.dX),this.rep.offsetY+i*(this.rep.height+this.rep.dY),this.rep.width,this.rep.height); 
				g_ctx.stroke();
				// draw draw green selection bounding rectangle with it's sizes
				g_ctx.beginPath();
				g_ctx.lineWidth="0";
				g_ctx.strokeStyle="green";
				g_ctx.rect(this.rep.offsetX+j*(this.rep.width+this.rep.dX)-this.rep.boundingPadding,this.rep.offsetY+i*(this.rep.height+this.rep.dY)-this.rep.boundingPadding,this.rep.width+2*this.rep.boundingPadding,this.rep.height+2*this.rep.boundingPadding); 
				g_ctx.stroke();
				// draw rectangle of animation frame (with paddings)
				g_ctx.beginPath();
				g_ctx.lineWidth="0";
				g_ctx.strokeStyle="red";
				g_ctx.rect(this.rep.offsetX+j*(this.rep.width+this.rep.dX)-this.rep.padding.left,this.rep.offsetY+i*(this.rep.height+this.rep.dY)-this.rep.padding.top,this.rep.width+this.rep.padding.left+this.rep.padding.right,this.rep.height+this.rep.padding.top+this.rep.padding.bottom); 
				g_ctx.stroke();
		}
		this.__proto__.Draw();
	}
	this.Update = function(){
		this.__proto__.Update();
	}
}

// Work in progress...
function CMapEditorStage() {
	this.__proto__ = new CStage();
	this.widgets.push(new CImage(0, 0, 176, 25,"Data/hud_left_top.png"));
	this.widgets.push(new CImage(-1, 25, 23, 130,"Data/hud_left_left.png"));	
	this.widgets.push(new CImage(152, 25, 23, 130,"Data/hud_left_right.png"));	
	this.widgets.push(new CImage(0, 155, 176, 325,"Data/hud_left_bottom.png"));
	this.widgets.push(new CImage(176, 0, 464, 15, "Data/hud_right_top.png"));
	this.widgets.push(new CImage(176,465,464,15, "Data/hud_right_bottom.png"));
	this.widgets.push(new CImage(624,0,16,480,"Data/hud_right_right.png"));	
	this.widgets.push(new CButton(25,3,124,17,"Data/game_button_menu.png","","",function(){g_application.currentStage = new CMainStage()}));
	this.widgets.push(new CEditorViewport(177,16,448,448,"Data/Maps/test.txt"));
	this.Draw = function(){
		this.__proto__.Draw();
	}
	this.Update = function(){
		this.__proto__.Update();
	}
}

// TODO: delete g_ctx, use g_canvas.GetContext() instead
var g_ctx = undefined; 
var g_canvas = new CCanvas(640,480,2);

var g_unitTypes = [];
var g_decalTypes = [];
var g_abilities = [];
var g_resources = [];
var g_animations = [];
var g_player = new CPlayer();
var g_viewport = 0;
var g_application = new CApplication();
g_application.currentStage = new CMainStage();
// Start program
g_application.Run();