BasicGame.Test = function(game) {

	// chap 1
	var map;
	var backgroundLayer;
	var blockLayer;

	// chap 2
	var player;

	var jumpTimer = 0;
	var cursors;
	var jumpButton;

};

BasicGame.Test.prototype = {

	create: function() {

		this.world.setBounds(0, 0, 640, 640);

		this.map = this.add.tilemap('Tilemap');
    	this.map.addTilesetImage('scifi_platformTiles_32x32', 'Tileset');

    	this.backgroundLayer = this.map.createLayer('Background');
    	this.blockLayer = this.map.createLayer('BlockLayer');

    	this.physics.arcade.gravity.y = 300;
    	this.setupPlayer();

    	this.cursors = this.input.keyboard.createCursorKeys();
  		this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  		this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

  		this.map.setCollisionBetween(771, 773, true, 'BlockLayer');

	},
	
	update: function() {

		this.game.physics.arcade.collide(this.player, this.blockLayer);

		this.player.body.velocity.x = 0; //default speed - stationary

		if (this.cursors.left.isDown) {
		      this.player.scale.x = -1;
		      this.player.body.velocity.x = -150;
		      this.player.animations.play('move');
		  }
		else if (this.cursors.right.isDown) {
		      this.player.scale.x = 1;
		      this.player.body.velocity.x = 150;
		      this.player.animations.play('move');
		  }
		else {
		      this.player.animations.stop();
		      this.player.frame = 5;
		  }

		if (this.jumpButton.isDown && this.player.body.onFloor() 
			&& this.time.now > this.jumpTimer) {
		      this.player.body.velocity.y = -250;
		      this.jumpTimer = this.time.now + 750;
		  }
	},

	setupPlayer: function() {

		this.player = this.add.sprite(32, this.world.height - 64, 'Player');
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		//this.player.scale.setTo(1, 1);
		this.player.body.collideWorldBounds = true;
		this.player.body.setSize(32, 32, 0, 0);

	},
	
}