PlayerUnit = function(x, y, player, unitType, frameNumber, game) {

	// default unit type
	if(unitType === '') {
		unitType = 'Tank';
	}

	// default player
	if(player === '') {
		player = 'Player1';
	}

	// unit sprite
	if(unitType === 'Tank') {

		Phaser.Sprite.call(this, game, x, y, player + "_Tank");

		this.moveRange    = 6;
		this.attackRange  = 1;
		this.blindRange   = 0; 
		this.attackPower  = 5;
		this.defensePower = 2; 

	} else if(unitType === 'Infantry') {

		Phaser.Sprite.call(this, game, x, y, player + "_Infantry");

		this.moveRange    = 2;
		this.attackRange  = 1;
		this.blindRange   = 0;
		this.attackPower  = 4;
		this.defensePower = 1; 

	}

	// two player only
	this.player = player;
	this.frame = parseInt(frameNumber);

	// general variables (don't need origin in center)
	this.anchor.setTo(0, 0);
	this.player    = player;
	this.moves     = 1;
	this.attacks   = 1;
	this.hitpoints = 10;

	// add hitpoint display
	this.text = this.addChild(this.game.add.text(0,0, this.hitpoints, 
			{font:"bold 12px Arial",align:"left", fill:"#ffffff", stroke:"#000000", strokeThickness:2}));
	this.text.anchor.setTo(0, 0);

};

PlayerUnit.prototype = Object.create(Phaser.Sprite.prototype);
PlayerUnit.prototype.constructor = PlayerUnit;
PlayerUnit.prototype.update = function() {


};