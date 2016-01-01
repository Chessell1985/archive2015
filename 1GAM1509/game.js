BasicGame.Game = function(game) {

	var map, layer, tiles;

	var landTile, waterTile, sandTile;

	var units, selectedUnit;

	var spaces;

	var activePlayer, playerMoving;

	var hud, playerIcon, playerIconShadow, playerText, announcerText;

	var waitForAnimation;

};

BasicGame.Game.prototype = {

	create: function() {

		// world settings
		this.stage.backgroundColor = '#000000';
		this.world.setBounds(0, 0, 620, 400);

		// tilemap and tileset
		this.map = this.add.tilemap('Tilemap');
		this.map.addTilesetImage('tileset','Tileset');
		this.layer = this.map.createLayer('Layer1');
		//this.tiles = this.layer.getTiles(0, 0, this.world.width, this.world.height);

		//this.tiles.forEach(function(tile) {
			//console.log('Tile at ' + (tile.worldX + 16) + ',' + (tile.worldY + 16) + ' has index ' + tile.index + '.');
		//}, this);

		this.landTile = 1;
		this.waterTile = 5;
		this.sandTile = 9;

		this.se_explode = this.add.audio('SE_Explode', 0.5, false);
		this.se_select = this.add.audio('SE_Select', 0.5, false);
		this.se_move = this.add.audio('SE_Move', 0.5, false);

		// create group
		this.spaces = this.add.group();
		this.units  = this.add.group();
		this.hud    = this.add.group();
		
		// create units
		this.addPlayerUnits();

		// world input
		this.game.input.onDown.add(this.playerTouch, this);
		
		this.resetKeys();
		BasicGame.other_keys = {

			enter: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),

		};
		BasicGame.other_keys.enter.onDown.add(this.playerTurn, this);

		this.announcerText = this.game.add.text(-1000, 240, "", 
			{font:"bold 32px Arial",align:"left", fill:"#ffffff", stroke:"#000000", strokeThickness:6});
		this.announcerText.anchor.setTo(0.5, 0.5);

		// starting setup
		this.buildHUD();

		this.playerTurn();

	},

	test: function() {

			var explosion = this.game.add.sprite(320, 240, 'Explosion');
			explosion.anchor.setTo(0, 0);
			explosion.animations.add('Explode');
			explosion.animations.play('Explode', 10, false, true);
			this.se_explode.play();

	},

	addPlayerUnits: function() {

		this.map.objects['ObjectLayer1'].forEach(function(element) {

			this.units.add(new PlayerUnit(element.x, element.y, 
				element.properties.player, element.properties.unit, element.properties.frame, this.game));

		}, this);

	},
	
	update: function() {

	},

	buildHUD: function() {

		// player icon shadow
		this.playerIconShadow = this.hud.create(15, 15, 'PlayerIcon');
		this.playerIconShadow.anchor.setTo(0, 0);
		this.playerIconShadow.tint = 0x000000;
		this.playerIconShadow.alpha = 0.5;

		// player icon
		this.playerIcon = this.hud.create(10, 10, 'PlayerIcon');
		this.playerIcon.anchor.setTo(0, 0);
		this.playerIcon.frame = 0;
		this.playerIcon.inputEnabled = true;
		this.playerIcon.events.onInputOver.add(this.movePlayerIcon, this);

		// player name
		this.playerText = this.game.add.text(80, 10, "", 
			{font:"bold 20px Arial",align:"center", fill:"#ffffff", stroke:"#000000", strokeThickness:2});
		this.playerText.anchor.setTo(0, 0);
		this.playerText.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 0);
		this.playerText.inputEnabled = true;
		this.playerText.events.onInputOver.add(this.movePlayerIcon, this);

	},

	movePlayerIcon: function() {

		if(this.playerIcon.x === 10) {

			this.playerIconShadow.x = 635;
			this.playerIcon.x = 630;
			this.playerText.x = 560;
			this.playerIconShadow.anchor.setTo(1,0);
			this.playerIcon.anchor.setTo(1,0);
			this.playerText.anchor.setTo(1,0);

		} else {

			this.playerIconShadow.x = 15;
			this.playerIcon.x = 10;
			this.playerText.x = 80;
			this.playerIconShadow.anchor.setTo(0,0);
			this.playerIcon.anchor.setTo(0,0);
			this.playerText.anchor.setTo(0,0);

		}

	},

	playerTurn: function() {

		if(this.gameIsOver === true) {

			return;

		}

		if(this.waitForAnimation === true) {

			return;

		}

		this.waitForAnimation = true;

		// two player only
		this.activePlayer = (this.activePlayer === 'Player1') ? 'Player2' : 'Player1';
		this.playerMoving = false;
		this.selectedUnit = null;

		this.spaces.removeChildren();

		this.announcerText.setText(this.activePlayer + "'s Turn!");
		var tween1 = this.game.add.tween(this.announcerText).to({x: 320}, 
			500, Phaser.Easing.Default, false);
		var tween2 = this.game.add.tween(this.announcerText).to({x: 1640}, 
			500, Phaser.Easing.Default, false);
		tween2.delay(1500, 0);
		tween1.chain(tween2);

		tween2.onComplete.add(function() {

			this.units.forEach(function(unit) {

				if(unit.player === this.activePlayer) {

					unit.moves   = 1;
					unit.attacks = 1;

				}

			}, this);

			this.announcerText.x = -1000;

			this.waitForAnimation = false;

		}, this);

		this.playerIcon.frame = (this.activePlayer === 'Player1') ? 0 : 1;
		this.playerText.setText(this.activePlayer);

		tween1.start();

	},

	resetKeys: function() {

		BasicGame.other_keys.enter.reset();

	},

	playerTouch: function(location) {

		// resolve into coordinates at the centre of each square
		var resolvedX = (Math.floor((location.x) / 32) * 32);
		var resolvedY = (Math.floor((location.y)/ 32) * 32);

		//console.log('Touched at square ' + resolvedX + ',' + resolvedY + '.');

		// find a unit at the same coordinates
		var selectedUnit = null;

		this.units.children.forEach(function(unit) {
			if (resolvedX === unit.x && resolvedY === unit.y) {
				selectedUnit = unit;
				return;
			}
		}, this);

		// did the player select a unit?
		if(selectedUnit !== null) {

			// did the player select one of their own?
			if(selectedUnit.player === this.activePlayer) {

				// select a unit
				this.selectUnit(selectedUnit);

			} else {

				// did the player already select a unit of their own?
				if(this.selectedUnit.player === this.activePlayer) {

					// is the player attacking?
					if(this.playerMoving === false) {

						// can the unit attack?
						if(this.selectedUnit.attacks > 0) {

							// attack unit
							this.attackUnitWithUnit(selectedUnit, this.selectedUnit);

						}

					}

				}

			}

		} else {

			// select a space
			this.selectSpace({x: resolvedX, y: resolvedY});
			this.spaces.removeChildren();

		}

	},

	selectUnit: function(unit) {

		// did the player not already select this unit?
		if(this.selectedUnit !== unit) {

			// can the unit move?
			if(unit.moves > 0) {

				// show possible moves
				this.showmoveRange(unit, 'Move');
				this.selectedUnit = unit;
				this.playerMoving = true;
				this.se_select.play();


			// can the unit attack?
			} else if(this.canAttack(unit)) {

				// show possible attacks
				this.showAttackSpaces(unit, 'Attack');
				this.selectedUnit = unit;
				this.playerMoving = false;
				this.se_select.play();
			}

			// do nothing if can't move nor attack
			return;

		// did the player already select a unit?
		} else {

			// is the player attacking and can the unit move?
			if(this.playerMoving === false && unit.moves > 0) {

				// show possible moves
				this.showmoveRange(unit, 'Move');
				this.selectedUnit = unit;
				this.playerMoving = true;
				this.se_select.play();


			// is the player moving and can the unit attack?
			} else if(this.playerMoving === true && this.canAttack(unit)) {

				// show possible attacks
				this.showAttackSpaces(unit, 'Attack');
				this.selectedUnit = unit;
				this.playerMoving = false;
				this.se_select.play();
			}

			// do nothing if can't move nor attack
			return;

		}

	},

	selectSpace: function(space) {

		var unit = this.selectedUnit;

		// is a unit selected?
		if(unit !== null) {

			// is the player moving?
			if(this.playerMoving === true) {

				// use new method
				this.canMoveUnitToSpace(unit, space, true);

			}

		}

		// reset
		this.selectedUnit = null;

	},

	turnIsOver: function() {

		// if no unit can move or attack then pass turn to next player
		var turnIsOver = true;
		//
		this.units.forEach(function(unit) {

			if(unit.player === this.activePlayer) {

				if(unit.moves > 0 || unit.attacks > 0) {

					turnIsOver = false;
					return;

				}

			}

		}, this);
		//
		return turnIsOver;

	},

	gameIsOver: function() {

		var opponentExists = false;
		var playerExists = false;
		var gameIsOver = true;

		var player = this.activePlayer === 'Player1' ? 'Player2' : 'Player1';
		//console.log('Checking units for player: ' + player);

		this.units.forEach(function(unit) {

			if(unit.player === this.activePlayer) {

				playerExists = true;

			} else {

				opponentExists = true;

			}

			if(playerExists === true && opponentExists === true) {

				gameIsOver = false;
				return;

			}

		}, this);

		if(gameIsOver === false) {

			return false;

		} else {

			if(opponentExists === true) {

				this.activePlayer = this.activePlayer === 'Player1' ? 'Player2' : 'Player1';

			}

			return true;

		}

	},

	gameOver: function() {

		this.resetKeys();

		this.units.forEach(function(unit) {

			unit.moves = 0;
			unit.attacks = 0;

		}, this);

		this.announcerText.setText(this.activePlayer + " Wins!");

		var tween1 = this.game.add.tween(this.announcerText).to({x: 320}, 
			500, Phaser.Easing.Default, false);
		var tween2 = this.game.add.tween(this.announcerText).to({x: 1640}, 
			500, Phaser.Easing.Default, false);
		tween2.delay(1500, 0);
		tween1.chain(tween2);

		tween2.onComplete.add(function() {

			this.game.state.start("MainMenu");

		}, this);

		tween1.start();

		//console.log('Game Over, ' + this.activePlayer + ' wins!');

	},

//  ### ATTACKING

	canAttack: function(unit) {

		var spaces = unit.attackRange;
		var canAttack = false;
		var manhattanDistance;

		// unit is not an attacking unit
		if(spaces === 0) {

			return canAttack;

		}

		// unit has no attacks left
		if(unit.attacks <= 0) {

			return canAttack;

		} 

		// unit in range with an enemy unit
		this.units.forEach(function(enemyUnit) {

			if(enemyUnit.player !== this.activePlayer) {

				manhattanDistance = this.manhattanDistance(unit, enemyUnit);

				if(manhattanDistance > unit.blindRange && manhattanDistance <= unit.attackRange){

					canAttack = true;

				}

			}

		}, this)


		return canAttack;

	},

	showAttackSpaces: function(unit, option) {

		// remove selected/move/attack spaces
		this.spaces.removeChildren();

		// put selected space under unit
		var space     = null;
		var spaces    = 0;
		var spaceType = '';

		space = this.spaces.create(unit.x, unit.y, 'SelectedSpace');
		space.anchor.setTo(0, 0);

		spaces = unit.attackRange;

		// starting from top left, show move spaces
		var topLeftX = unit.x - (32 * spaces);
		var topLeftY = unit.y - (32 * spaces);
		var spaceX, spaceY, manhattanDistance;
		//
		for(i = 0; i <= (spaces * 2); i++) {

			spaceX = topLeftX + (i * 32);

			for(j = 0; j <= (spaces * 2); j++) {

				spaceY = topLeftY + (j * 32);

				manhattanDistance = this.manhattanDistance(unit, {x: spaceX, y: spaceY});

				if(manhattanDistance > unit.blindRange && manhattanDistance <= unit.attackRange) {

					space = this.spaces.create(spaceX, spaceY, 'AttackSpace');
					space.anchor.setTo(0, 0);					

				}

			}

		}

	},

	attackUnitWithUnit: function(defendingUnit, attackingUnit) {

		// unit cannot move or attack for remainder of turn
		attackingUnit.attacks = 0;
		attackingUnit.moves   = 0;

		var damageGiven, damageTaken, explosion, explosionX, explosionY;

		damageGiven = ((this.game.rnd.integerInRange(1,6) + attackingUnit.hitpoints) / 10) 
			* (attackingUnit.attackPower - defendingUnit.defensePower);
		damageGiven = Math.floor(damageGiven); 
		damageTaken = 0;

		// dealing damage?
		if(damageGiven > 0) {

			defendingUnit.hitpoints -= damageGiven;

		}

		// is defending unit dead?
		if(defendingUnit.hitpoints <= 0) {

			explosionX = defendingUnit.x;
			explosionY = defendingUnit.y

			defendingUnit.destroy();

			explosion = this.add.sprite(explosionX, explosionY, 'Explosion');
			explosion.anchor.setTo(0, 0);
			explosion.animations.add('Explode');
			explosion.animations.play('Explode', 15, false, true);
			this.se_explode.play();

		} else {

			defendingUnit.text.setText(defendingUnit.hitpoints);
			damageTaken = ((this.game.rnd.integerInRange(1,6) + defendingUnit.hitpoints) / 10) 
			* (defendingUnit.attackPower - attackingUnit.defensePower); 
			damageTaken = Math.floor(damageTaken); 
		
		}

		// taking damage?
		if(damageTaken > 0) {

			attackingUnit.hitpoints -= damageTaken;

		}

		// is attacking unit dead?
		if(attackingUnit.hitpoints <= 0) {

			explosionX = attackingUnit.x;
			explosionY = attackingUnit.y

			attackingUnit.destroy();

			explosion = this.add.sprite(explosionX, explosionY, 'Explosion');
			explosion.anchor.setTo(0, 0);
			explosion.animations.add('Explode');
			explosion.animations.play('Explode', 15, false, true);
			this.se_explode.play();

		} else {

			attackingUnit.text.setText(attackingUnit.hitpoints);

		}

		this.spaces.removeChildren();

		// is game over?
		if(this.gameIsOver() === true) {

			this.gameOver();
			return;

		}

		// pass turn to next player?
		if(this.turnIsOver() === true) {

			this.playerTurn();

		}

	},

//  ### MOVEMENT

	showmoveRange: function(unit, option) {

		// remove selected/move/attack spaces
		this.spaces.removeChildren();

		// put selected space under unit
		var space     = null;
		var spaces    = 0;
		var spaceType = '';

		spaces = unit.moveRange;

		space = this.spaces.create(unit.x, unit.y, 'SelectedSpace');
		space.anchor.setTo(0, 0);

		// starting from top left, show move spaces
		var topLeftX = unit.x - (32 * spaces);
		var topLeftY = unit.y - (32 * spaces);
		var spaceX ,spaceY ,stepsX ,stepsY;
		//
		for(i = 0; i <= (spaces * 2); i++) {

			spaceX = topLeftX + (i * 32);

			for(j = 0; j <= (spaces * 2); j++) {

				spaceY = topLeftY + (j * 32);

				if(this.canMoveUnitToSpace(unit, {x: spaceX, y: spaceY}, false) === true &&
					!(spaceX === unit.x && spaceY === unit.y)) {

					space = this.spaces.create(spaceX, spaceY, 'MoveSpace');
					space.anchor.setTo(0, 0);					

				}

			}

		}

	},

	canMoveUnitToSpace: function(unit, targetSpace, moveToSpace) {

		if(this.spaceIsOccupied(targetSpace) === true || 
			this.spaceIsImpassable(targetSpace) === true || 
			this.manhattanDistance(unit, targetSpace) > unit.moveRange) {

			return false;

		} 

		// once space is determined as passable terrain
		// unoccupied and within range, use A* algorithm
		var openList = [];
		var closedList = [];
		var moveList = [];
		var adjacentSpaces;
		var currentSpace;
		var canMoveUnitToSpace = false;

		// add unit to openList with all scores at zero
		openList.push({x: unit.x, y: unit.y, f: 0, g: 0, h: 0, parent: null});

		// start algorithm
		while(openList.length > 0) {

			// sort open list by their f score
			openList.sort(function(a,b) {

				return (a.f > b.f) ? 1 : ((b.f > a.f) ? -1 : 0);

			});

			// take first item from openList
			currentSpace = openList[0];

			// add to closedList
			closedList.push(currentSpace);

			// remove from openList
			openList.splice(0, 1);

			// break loop if we have reached destination
			if(this.spaceIsInList(closedList, targetSpace) === true) {

				canMoveUnitToSpace = true;

				// create move sequence to create as chain of tweens
				if(moveToSpace === true) {

					while(currentSpace.parent !== null) {

						// insert at first index to have tween in correct order
						moveList.splice(0, 0, currentSpace);
						currentSpace = currentSpace.parent;

					}

				}

				break;

			}

			// break loop if maximum moves has been reached
			if(currentSpace.g < unit.moveRange) {

				// collect adjacent movable spaces
				adjacentSpaces = this.collectAdjacentSpaces(currentSpace, targetSpace);

			}

			// loop through adjacent spaces
			adjacentSpaces.forEach(function(space) {

				// ignore space if in closed list
				if(this.spaceIsInList(closedList, space) === true) {

				// add to open list if not there
				} else if(this.spaceIsInList(openList, space) === false) {

					openList.push(space);

				} 

			}, this);

		}

		if(moveToSpace === true) {

			this.moveUnitBySpaces(unit, moveList);

		}

		// return bool
		return canMoveUnitToSpace;

	},

	spaceIsOccupied: function(space) {

		var x = space.x;
		var y = space.y;
		
		var spaceIsOccupied = false;

		this.units.forEach(function(unit) {

			if(unit.x === x && unit.y === y && unit.player !== this.activePlayer) {

				spaceIsOccupied = true;
				return;

			}

		}, this);

		return spaceIsOccupied;

	},

	spaceIsImpassable: function(space) {

		var tiles = this.layer.getTiles(space.x, space.y, 32, 32);
		var tile = tiles[0];

		if(tile) {

			if(tile.index === this.waterTile) {

				return true;

			}

		}

		return false;

	},

	manhattanDistance: function(start, finish) {

		var manhattanDistance = 0;

		var x = start.x;
		var y = start.y;

		while(x !== finish.x || y !== finish.y) {

			if(x !== finish.x) {

				x += (finish.x > x) ? 32 : -32;
				manhattanDistance += 1;

			}

			if(y !== finish.y) {

				y += (finish.y > y) ? 32 : -32;
				manhattanDistance += 1;

			}

		}	

		return manhattanDistance;

	},

	collectAdjacentSpaces: function(startSpace, targetSpace) {

		var adjacentSpaces = [];
		var adjacentSpace;

		// 1st space - to the left
		adjacentSpace = {x: 0, y: 0, f: 0, g: 0, h: 0, parent: null,};

		adjacentSpace.x = startSpace.x - 32;
		adjacentSpace.y = startSpace.y;
		adjacentSpace.g = startSpace.g + this.movementCost(adjacentSpace);
		adjacentSpace.h = this.manhattanDistance(adjacentSpace, targetSpace);
		adjacentSpace.f = adjacentSpace.g + adjacentSpace.h;
		adjacentSpace.parent = startSpace;

		if(this.spaceIsOccupied(adjacentSpace) === false && 
			this.spaceIsImpassable(adjacentSpace) === false) {

			adjacentSpaces.push(adjacentSpace);

		}

		// 2nd space - above
		adjacentSpace = {x: 0, y: 0, f: 0, g: 0, h: 0, parent: null,};

		adjacentSpace.x = startSpace.x;
		adjacentSpace.y = startSpace.y - 32;
		adjacentSpace.g = startSpace.g + this.movementCost(adjacentSpace);
		adjacentSpace.h = this.manhattanDistance(adjacentSpace, targetSpace);
		adjacentSpace.f = adjacentSpace.g + adjacentSpace.h;
		adjacentSpace.parent = startSpace;

		if(this.spaceIsOccupied(adjacentSpace) === false && 
			this.spaceIsImpassable(adjacentSpace) === false) {

			adjacentSpaces.push(adjacentSpace);

		}

		// 3rd space - to the right
		adjacentSpace = {x: 0, y: 0, f: 0, g: 0, h: 0, parent: null,};

		adjacentSpace.x = startSpace.x + 32;
		adjacentSpace.y = startSpace.y;
		adjacentSpace.g = startSpace.g + this.movementCost(adjacentSpace);
		adjacentSpace.h = this.manhattanDistance(adjacentSpace, targetSpace);
		adjacentSpace.f = adjacentSpace.g + adjacentSpace.h;
		adjacentSpace.parent = startSpace;

		if(this.spaceIsOccupied(adjacentSpace) === false && 
			this.spaceIsImpassable(adjacentSpace) === false) {

			adjacentSpaces.push(adjacentSpace);

		}

		// 4th space - below
		adjacentSpace = {x: 0, y: 0, f: 0, g: 0, h: 0, parent: null,};

		adjacentSpace.x = startSpace.x;
		adjacentSpace.y = startSpace.y + 32;
		adjacentSpace.g = startSpace.g + this.movementCost(adjacentSpace);
		adjacentSpace.h = this.manhattanDistance(adjacentSpace, targetSpace);
		adjacentSpace.f = adjacentSpace.g + adjacentSpace.h;
		adjacentSpace.parent = startSpace;

		if(this.spaceIsOccupied(adjacentSpace) === false && 
			this.spaceIsImpassable(adjacentSpace) === false) {

			adjacentSpaces.push(adjacentSpace);

		}

		return adjacentSpaces;

	},

	movementCost: function(space) {

		var tiles = this.layer.getTiles(space.x, space.y, 32, 32);
		var tile = tiles[0];

		if(tile) {

			if(tile.index === this.landTile) {

				return 1;

			} else if(tile.index === this.waterTile) {

				return 1;

			} else if(tile.index === this.sandTile) {

				return 2;

			}

		}

		// default cost of 1
		return 1;

	},

	spaceIsInList: function(list, space) {

		var spaceIsInList = false;

		list.forEach(function(spaceInList) {

			if(spaceInList.x === space.x && 
				spaceInList.y === space.y) {

				spaceIsInList = true;
				return

			}

		}, this);

		return spaceIsInList;

	},

	moveUnitBySpaces: function(unit, moveList) {

		var step;
		var previousStep;
		var newX, newY;
		var firstTween;
		var previousTween;
		var tween;
		var newFrame;

		// get first move
		step = moveList[0];

		// decide unit direction
		unit.frame = (step.x !== unit.x) ? ((step.x > unit.x) ? 0 : 3) : ((step.y > unit.y) ? 2 : 1);

		// set the first tween
		firstTween = this.game.add.tween(unit).to({x: step.x, y: step.y}, 100, Phaser.Easing.Default, false);

		// set first tween as previous tween
		previousTween = firstTween;

		// set step as previous step
		previousStep = step;

		if(moveList.length > 1) {

			for(i = 1; i < moveList.length; i++) {

				// get next move
				step = moveList[i];

				// change direction of unit before next tween
				// need to set to a constant otherwise this function will
				// set the value to whatever the variable value is at that
				// point in time
				if(step.x !== previousStep.x) {

					if(step.x > previousStep.x) {

						previousTween.onComplete.add(function() {
							
							unit.frame = 0;

						}, this);

					} else {

						previousTween.onComplete.add(function() {
							
							unit.frame = 3;

						}, this);

					}

				} else {

					if(step.y > previousStep.y) {

						previousTween.onComplete.add(function() {
							
							unit.frame = 2;

						}, this);						

					} else {

						previousTween.onComplete.add(function() {
							
							unit.frame = 1;

						}, this);

					}

				}

				// create next tween
				tween = this.game.add.tween(unit).to({x: step.x, y: step.y}, 100, Phaser.Easing.Default, false);

				// chain to last tween
				previousTween.chain(tween);

				// set last tween to this tween
				previousTween = tween;

				// set last step to this step
				previousStep = step;

			}

		}

		unit.moves -= 1;

		// pass turn to next player?
		previousTween.onComplete.add(function() {

			unit.moves = 0;
				
			if(unit.blindRange > 0) {

				unit.attacks = 0;

			}

			if(this.canAttack(unit) === true) {

				this.showAttackSpaces(unit, 'Attack');
				this.selectUnit(unit);

			} else {

				unit.attacks = 0;

			}

			if(this.turnIsOver() === true) {

				this.playerTurn();

			}

		}, this);
		
		firstTween.start();
		this.se_move.play();

	},

	
}