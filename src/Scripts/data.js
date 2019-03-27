// Game configuration.
var g_config = {
	debug_showBackBuffers : false,      // Turn it on to see back-buffers
	debug_showPassableCells : false,	// Turn it on to see non-passable cells
	gameCircleFrequency : 30			// Update/Draw Frames per second
}

function CDefaultMap() {	
	this.__proto__ = new CMap(16,16);
	this.SetTile(0,0,16*19);
	this.SetTile(1,0,16*19);
	this.SetTile(2,0,16*19);
	this.SetTile(3,0,11*19+11);
	this.SetTile(4,0,11*19-2);
	this.SetTile(9,0,7*19-3);
	this.SetTile(10,0,7*19-2);
	this.SetTile(11,0,7*19-4);
	this.SetTile(13,0,7*19-3);
	this.SetTile(14,0,7*19-9);
	this.SetTile(15,0,7*19-8);
	//
	this.SetTile(0,1,16*19);
	this.SetTile(1,1,16*19);
	this.SetTile(2,1,11*19+11);
	this.SetTile(3,1,11*19-2);
	this.SetTile(15,1,7*19-10);
	//
	this.SetTile(0,2,16*19);
	this.SetTile(1,2,11*19+10);
	this.SetTile(2,2,11*19-2);
	this.SetTile(0,3,16*19);
	this.SetTile(1,3,11*19+7);
	this.SetTile(0,4,11*19+1);
	this.SetTile(1,4,11*19-3);
	this.SetTile(7,7,19*18+16); 
	this.SetTile(9,11,19*18+17); 
	this.SetTile(10,4,19*18+18); 
	// dirt
	this.SetTile(0,5,15*19-10);
	this.SetTile(1,5,15*19-11);		
	this.SetTile(2,5,15*19-15);		
	this.SetTile(2,4,15*19-4);		
	this.SetTile(2,3,15*19-1);
	this.SetTile(3,3,15*19-9);				
	this.SetTile(4,3,15*19-15);			
	this.SetTile(3,2,18*19-6);				
	this.SetTile(4,2,15*19-5);
	this.SetTile(4,1,15*19-1);				
	this.SetTile(5,1,15*19-14);
	this.SetTile(5,0,15*19-4);
	//fortress
	this.SetTile(13,8,19);
	this.SetTile(14,8,19+8);
	this.SetTile(15,8,19+7);
	this.SetTile(13,9,19+2);
	this.SetTile(15,9,19+5);
	this.SetTile(13,10,3*19-1);
	this.SetTile(15,10,19+1);
}


// You can set your map in such manner
var newMap = {
	width : 20,
	height : 20,
	matrix : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

// Set up all unit types and decal types, register resources and set up animation params
function InitializeGameData() {
			var icons = new CSpriteAnimation("Data/icons.png");
		icons.offsetX = 6;
		icons.offsetY = 5;
		icons.dX = 3;
		icons.dY = 3;
		icons.width = 46;
		icons.height = 38;
		g_resources["icons"] = icons;
		var buildings = new CSpriteAnimation("Data/Animations/alliance_buildings_summer.png");
		buildings.offsetX = 7;
		buildings.offsetY = 4;
		buildings.dX = 0;
		buildings.dY = 0;
		buildings.padding.left = 0;
		buildings.padding.top = 0;
		buildings.padding.right = 32*3;
		buildings.padding.bottom = 32*3;		
		g_resources["buildings"] = buildings;
				
		g_abilities["alliance_move"] = new CMoveAbility();
		g_abilities["alliance_attack"] = new CAttackAbility();

		var currentUnit = g_unitTypes["town_hall"] = new CUnitType("",0);
		g_unitTypes["town_hall"].representation = g_resources["buildings"];
		g_unitTypes["town_hall"].building = true;
		g_unitTypes["town_hall"].iconId = 40;
		g_unitTypes["town_hall"].frameX = 8;
		g_unitTypes["town_hall"].frameY = 0;
		g_unitTypes["town_hall"].scale.x = 4;
		g_unitTypes["town_hall"].scale.y = 4;

		currentUnit = g_unitTypes["peasant"] = new CUnitType("Data/Animations/alliance_peasant.png",4);
		g_unitTypes["peasant"].representation.padding.left = 4;
		g_unitTypes["peasant"].representation.padding.top = 4;
		g_unitTypes["peasant"].representation.padding.right = 4;
		g_unitTypes["peasant"].representation.padding.bottom = 4;
		g_unitTypes["peasant"].iconId = 0;
		g_unitTypes["peasant"].abilities.push( g_abilities["alliance_move"] );
		g_unitTypes["peasant"].abilities.push( new CAbility(164) );
		g_unitTypes["peasant"].abilities.push( g_abilities["alliance_attack"] );
		g_unitTypes["peasant"].abilities.push( new CAbility(85) );
		g_unitTypes["peasant"].abilities.push( new CAbility(86) );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0);
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		currentUnit = g_unitTypes["footman"] = new CUnitType("Data/Animations/alliance_footman.png",3);
		g_unitTypes["footman"].representation.offsetX = 20;
		g_unitTypes["footman"].representation.offsetY = 19;
		g_unitTypes["footman"].representation.dX = 42;
		g_unitTypes["footman"].representation.dY = 23;
		g_unitTypes["footman"].representation.padding.left = 14;
		g_unitTypes["footman"].representation.padding.right = 14;
		g_unitTypes["footman"].representation.padding.top = 12;
		g_unitTypes["footman"].representation.padding.bottom = 6;
		g_unitTypes["footman"].iconId = 2;
		g_unitTypes["footman"].abilities.push( g_abilities["alliance_move"] );
		g_unitTypes["footman"].abilities.push( new CAbility(164) );
		g_unitTypes["footman"].abilities.push( g_abilities["alliance_attack"] );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		g_unitTypes["footman"].firstName = "Human";
		g_unitTypes["footman"].secondName = "Footman";
		g_unitTypes["footman"].level = "Level 1";
		
		currentUnit = g_unitTypes["archer"] = new CUnitType("Data/Animations/alliance_elven_archer.png",4);
		g_unitTypes["archer"].representation.offsetX = 13;
		g_unitTypes["archer"].representation.offsetY = 17;
		g_unitTypes["archer"].representation.dX = 27;
		g_unitTypes["archer"].representation.dY = 42;
		g_unitTypes["archer"].representation.padding.left = 8;
		g_unitTypes["archer"].representation.padding.right = 8;
		g_unitTypes["archer"].representation.padding.top = 8;
		g_unitTypes["archer"].representation.padding.bottom = 8;
		g_unitTypes["archer"].iconId = 4;
		g_unitTypes["archer"].abilities.push( g_abilities["alliance_move"] );
		g_unitTypes["archer"].abilities.push( new CAbility(164) );
		g_unitTypes["archer"].abilities.push( new CAbility(124) );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		currentUnit = g_unitTypes["mage"] = new CUnitType("Data/Animations/alliance_mage.png",3);
		g_unitTypes["mage"].representation.offsetX = 20;
		g_unitTypes["mage"].representation.offsetY = 25;
		g_unitTypes["mage"].representation.dX = 42;
		g_unitTypes["mage"].representation.dY = 28;
		g_unitTypes["mage"].representation.padding.left = 8;
		g_unitTypes["mage"].representation.padding.right = 8;
		g_unitTypes["mage"].representation.padding.top = 20;
		g_unitTypes["mage"].representation.padding.bottom = 6;
		g_unitTypes["mage"].representation.boundingPadding = 2;
		g_unitTypes["mage"].iconId = 14;
		g_unitTypes["mage"].abilities.push( g_abilities["alliance_move"] );
		g_unitTypes["mage"].abilities.push( new CAbility(164) );
		g_unitTypes["mage"].abilities.push( new CAbility(99) );
		g_unitTypes["mage"].abilities.push( new CAbility(101) );
		g_unitTypes["mage"].abilities.push( new CAbility(94) );
		g_unitTypes["mage"].abilities.push( new CAbility(100) );
		g_unitTypes["mage"].abilities.push( new CAbility(95) );
		g_unitTypes["mage"].abilities.push( new CAbility(115) );
		g_unitTypes["mage"].abilities.push( new CAbility(105) );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		currentUnit = g_unitTypes["knight"] = new CUnitType("Data/Animations/alliance_knight.png",5);
		g_unitTypes["knight"].representation.offsetX = 25;
		g_unitTypes["knight"].representation.offsetY = 23;
		g_unitTypes["knight"].representation.dX = 42;
		g_unitTypes["knight"].representation.dY = 42;
		g_unitTypes["knight"].representation.padding.left = 17;
		g_unitTypes["knight"].representation.padding.top = 17;
		g_unitTypes["knight"].representation.padding.right = 17;
		g_unitTypes["knight"].representation.padding.bottom = 17;
		g_unitTypes["knight"].representation.boundingPadding = 6;
		g_unitTypes["knight"].iconId = 8;
		currentUnit.abilities.push( g_abilities["alliance_move"] );
		currentUnit.abilities.push( new CAbility(164) );
		currentUnit.abilities.push( g_abilities["alliance_attack"] );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		
		currentUnit = g_unitTypes["dwarf"] = new CUnitType("Data/Animations/alliance_dwarven_demolition_squad.png",3);
		g_unitTypes["dwarf"].representation.offsetX = 15;
		g_unitTypes["dwarf"].representation.offsetY = 10;
		g_unitTypes["dwarf"].representation.dX = 25;
		g_unitTypes["dwarf"].representation.dY = 19;
		g_unitTypes["dwarf"].representation.padding.left = 7;
		g_unitTypes["dwarf"].representation.padding.top = 7;
		g_unitTypes["dwarf"].representation.padding.right = 7;
		g_unitTypes["dwarf"].representation.padding.bottom = 7;
		g_unitTypes["dwarf"].iconId = 12;
		g_unitTypes["dwarf"].abilities.push( g_abilities["alliance_move"] );
		g_unitTypes["dwarf"].abilities.push(new CAbility (164));
		g_unitTypes["dwarf"].abilities.push( g_abilities["alliance_attack"] );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		currentUnit = g_unitTypes["ballista"] = new CUnitType("Data/Animations/alliance_ballista.png",2);
		g_unitTypes["ballista"].representation.offsetX = 15;
		g_unitTypes["ballista"].representation.offsetY = 16;
		g_unitTypes["ballista"].representation.dX = 35;
		g_unitTypes["ballista"].representation.dY = 30;
		g_unitTypes["ballista"].representation.padding.left = 15;
		g_unitTypes["ballista"].representation.padding.right = 15;
		g_unitTypes["ballista"].representation.padding.top = 12;
		g_unitTypes["ballista"].representation.padding.bottom = 17;
		g_unitTypes["ballista"].iconId = 16;
		currentUnit.animations["movement"] =  new CLinearAnimation(1,0);
		currentUnit.animations["attack"] =  new CLinearAnimation(1,2);
		
		currentUnit = g_unitTypes["catapult"] = new CUnitType("Data/Animations/orcs_catapult.png",2);
		g_unitTypes["catapult"].representation.offsetX = 15;
		g_unitTypes["catapult"].representation.offsetY = 16;
		g_unitTypes["catapult"].representation.dX = 35;
		g_unitTypes["catapult"].representation.dY = 35;
		g_unitTypes["catapult"].representation.padding.left = 15;
		g_unitTypes["catapult"].representation.padding.right = 15;
		g_unitTypes["catapult"].representation.padding.top = 17;
		g_unitTypes["catapult"].representation.padding.bottom = 13;
		g_unitTypes["catapult"].iconId = 17;
		currentUnit.animations["movement"] =  new CLinearAnimation(1,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(1,2);
		
		currentUnit = g_unitTypes["peon"] = new CUnitType("Data/Animations/orcs_peon.png",3);
		g_unitTypes["peon"].representation.padding.left = 4;
		g_unitTypes["peon"].representation.padding.top = 4;
		g_unitTypes["peon"].representation.padding.right = 4;
		g_unitTypes["peon"].representation.padding.bottom = 4;
		g_unitTypes["peon"].representation.offsetX = 12;
		g_unitTypes["peon"].representation.offsetY = 0;
		g_unitTypes["peon"].representation.dX = 18;
		g_unitTypes["peon"].representation.dY = 8;
		g_unitTypes["peon"].iconId = 1;
		currentUnit.abilities.push( g_abilities["alliance_move"] );
		currentUnit.abilities.push( new CAbility(164) );
		currentUnit.abilities.push( g_abilities["alliance_attack"] );
		g_unitTypes["peon"].abilities.push( new CAbility(85) );
		g_unitTypes["peon"].abilities.push( new CAbility(86) );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		currentUnit = g_unitTypes["grunt"] = new CUnitType("Data/Animations/orcs_grunt.png",4);
		g_unitTypes["grunt"].representation.padding.left = 5;
		g_unitTypes["grunt"].representation.padding.right = 5;
		g_unitTypes["grunt"].representation.padding.top = 10;
		g_unitTypes["grunt"].representation.padding.bottom = 5;
		g_unitTypes["grunt"].representation.boundingPadding = 2;
		g_unitTypes["grunt"].representation.offsetX = 25;
		g_unitTypes["grunt"].representation.offsetY = 15;
		g_unitTypes["grunt"].representation.dX = 43;
		g_unitTypes["grunt"].representation.dY = 23;
		g_unitTypes["grunt"].iconId = 3;
		currentUnit.abilities.push( g_abilities["alliance_move"] );
		currentUnit.abilities.push( new CAbility(164) );
		currentUnit.abilities.push( g_abilities["alliance_attack"] );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		currentUnit = g_unitTypes["death_knight"] = new CUnitType("Data/Animations/orcs_death_knight.png",5);
		g_unitTypes["death_knight"].representation.offsetX = 25;
		g_unitTypes["death_knight"].representation.offsetY = 23;
		g_unitTypes["death_knight"].representation.dX = 32;
		g_unitTypes["death_knight"].representation.dY = 35;
		g_unitTypes["death_knight"].representation.padding.left = 15;
		g_unitTypes["death_knight"].representation.padding.right = 15;
		g_unitTypes["death_knight"].representation.padding.top = 20;
		g_unitTypes["death_knight"].representation.padding.bottom = 10;
		g_unitTypes["death_knight"].iconId = 15;
		currentUnit.abilities.push( g_abilities["alliance_move"] );
		currentUnit.abilities.push( new CAbility(164) );
		currentUnit.abilities.push( g_abilities["alliance_attack"] );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		currentUnit = g_unitTypes["goblin"] = new CUnitType("Data/Animations/orcs_goblin_sappers.png",3);
		g_unitTypes["goblin"].representation.offsetX = 12;
		g_unitTypes["goblin"].representation.offsetY = 10;
		g_unitTypes["goblin"].representation.dX = 27;
		g_unitTypes["goblin"].representation.dY = 10;
		g_unitTypes["goblin"].representation.padding.left = 4;
		g_unitTypes["goblin"].representation.padding.right = 12;
		g_unitTypes["goblin"].representation.padding.top = 2;
		g_unitTypes["goblin"].representation.padding.bottom = 5;
		g_unitTypes["goblin"].iconId = 13;
		g_unitTypes["goblin"].abilities.push( g_abilities["alliance_move"] );
		g_unitTypes["goblin"].abilities.push(new CAbility (164));
		g_unitTypes["goblin"].abilities.push( g_abilities["alliance_attack"] );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		currentUnit = g_unitTypes["ogre"] = new CUnitType("Data/Animations/orcs_ogre.png",4);
		g_unitTypes["ogre"].representation.padding.left = 17;
		g_unitTypes["ogre"].representation.padding.right = 15;
		g_unitTypes["ogre"].representation.padding.top = 18;
		g_unitTypes["ogre"].representation.padding.bottom = 7;
		g_unitTypes["ogre"].representation.boundingPadding = 5;
		g_unitTypes["ogre"].representation.offsetX = 20;
		g_unitTypes["ogre"].representation.offsetY = 25;
		g_unitTypes["ogre"].representation.dX = 42;
		g_unitTypes["ogre"].representation.dY = 42;
		g_unitTypes["ogre"].maxHitPoints = 1000;
		g_unitTypes["ogre"].iconId = 9;
		g_unitTypes["ogre"].abilities.push( g_abilities["alliance_move"] );
		g_unitTypes["ogre"].abilities.push(new CAbility (164));
		g_unitTypes["ogre"].abilities.push( g_abilities["alliance_attack"] );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		currentUnit = g_unitTypes["troll"] = new CUnitType("Data/Animations/orcs_troll_axethrower.png",4);
		g_unitTypes["troll"].representation.offsetX = 24;
		g_unitTypes["troll"].representation.offsetY = 23;
		g_unitTypes["troll"].representation.dX = 27;
		g_unitTypes["troll"].representation.dY = 20;
		g_unitTypes["troll"].representation.padding.left = 8;
		g_unitTypes["troll"].representation.padding.right = 8;
		g_unitTypes["troll"].representation.padding.top = 17;
		g_unitTypes["troll"].representation.padding.bottom = 2;
		g_unitTypes["troll"].iconId = 5;
		g_unitTypes["troll"].abilities.push( g_abilities["alliance_move"] );
		g_unitTypes["troll"].abilities.push( new CAbility(164) );
		g_unitTypes["troll"].abilities.push( new CAbility(124) );
		currentUnit.animations["movement"] =  new CLinearAnimation(4,0)
		currentUnit.animations["attack"] =  new CLinearAnimation(3,5);
		
		g_decalTypes["target"] = new CDecalType(32,32,"Data/target.png");
		g_decalTypes["target"].representation.dX = 8;
		g_decalTypes["target"].representation.offsetX = 0;
		g_decalTypes["target"].representation.offsetY = 0;
		g_decalTypes["target"].representation.width = g_decalTypes["target"].width;
		g_decalTypes["target"].representation.height = g_decalTypes["target"].height;
		g_decalTypes["target"].lifeLength = 16;
}