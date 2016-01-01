BasicGame.Overworld = function(game) {

	var savedData;
	var arrayOfWords;

	var player;

	var items;
	var item;

	var blocks;
	var block;

	var doors;
	var door;
	var can_exit_room;

	var keys;
	var actions;

	var levelData;

	var menu;

};

BasicGame.Overworld.prototype = {

	create: function() {

		this.stage.backgroundColor = '#CCCCCC';

		this.keys = this.input.keyboard.createCursorKeys();

		this.actions = {
			a: this.input.keyboard.addKey(Phaser.Keyboard.A),
			s: this.input.keyboard.addKey(Phaser.Keyboard.S),
			d: this.input.keyboard.addKey(Phaser.Keyboard.D),
			q: this.input.keyboard.addKey(Phaser.Keyboard.Q),
		};

		this.keys.up.onDown.add(function () {
			this.player_jump();
		}, this);

		this.actions.a.onDown.add(function () {
			this.exit_room();
		}, this);

		this.actions.q.onDown.add(function () {
			this.toggle_menu();
		}, this);

		//save player data (where to put this?)
		localStorage.setItem('PlayerData',JSON.stringify(BasicGame.player_data));

		// menu
		this.menu = null;

		// platformer physics test...
		this.world.setBounds(0, 0, 720, 320);

		this.blocks = this.add.group();
		this.blocks.enableBody = true;
		this.blocks.physicsBodyType = Phaser.Physics.ARCADE;

		// ground floor
		this.block = this.blocks.create(0, this.world.height - 32, 'Block');
		this.block.scale.setTo(45,2);
		this.block.body.immovable = true;

		// platforms
		this.block = this.blocks.create(96, this.world.height - 128, 'Block');
		this.block.scale.setTo(3,1);
		this.block.body.immovable = true;

		this.block = this.blocks.create(288, this.world.height - 224, 'Block');
		this.block.scale.setTo(4,1);
		this.block.body.immovable = true;

		// Door
		this.doors = this.add.group();
		this.doors.enableBody = true;
		this.doors.physicsBodyType = Phaser.Physics.ARCADE;

		this.door = this.doors.create(this.world.width - 96, this.world.height - 96, 'Door');
		this.door.immovable = true;
		
		// items
		this.items = this.add.group();
		this.items.enableBody = true;
		this.items.physicsBodyType = Phaser.Physics.ARCADE;

		for(var i = 0; i < 12; i++) {
			this.item = this.items.create(480 + (i * 32), this.world.height - 128, 'Item');
		}

		/// player will spawn either in a default position or a door position
		// this is decided by the room which the player has moved from...
		switch(BasicGame.next_room_start_position) {
			case 'A' : // first door
				this.player = this.add.sprite(this.world.width - 160, this.world.height - 64, 'Player');
				break;

			default  : // no position specified
				this.player = this.add.sprite(96, this.world.height - 64, 'Player'); 
				break;

		}

		// player physics
		this.physics.arcade.enable(this.player);
		this.player.body.bounce.y = 0.1;
		this.player.body.gravity.y = 1000;
		this.player.body.collideWorldBounds = true;

		// player camera
		this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

		// level stringify test
		/*
		this.levelData = {
			levelNumber: 1,
			levelData: {
				platforms: {
					1: {
						x: 1,
						y: 2,
					},
					2: {
						x: 3,
						y: 4,
					},
				},
				player: {
					x: 0,
					y: 0,
				},
			}
		}

		this.levelData = JSON.stringify(this.levelData);
		console.log(this.levelData);
		*/

	},
	
	update: function() {

		// player interacts with platforms
		this.physics.arcade.collide(this.player, this.blocks);

		// player interacts with items
		//this.physics.arcade.collide(this.player, this.items);

		// player picks up items
		this.physics.arcade.overlap(this.player, this.items, this.collect_item, null, this);

		// can exit room?
		this.can_exit_room = false;

		this.physics.arcade.overlap(this.player, this.doors, this.enable_room_exit, null, this);

		// player movement
		this.player.body.velocity.x = 0;

		if (this.keys.left.isDown)
	    {
	        //  Move to the left
	        this.player.body.velocity.x = -250;

	        //player.animations.play('left');
	    }
	    else if (this.keys.right.isDown)
	    {
	        //  Move to the right
	        this.player.body.velocity.x = 250;

	        //player.animations.play('right');
	    }

	},
	
	pad: function(n, w, z) {
		z = z || "0";
		n = n + "";
		return n.length >= w ? n : new Array(w - n.length + 1).join(z) + n;		
	},

	// Player Actions
	player_jump: function() {

		if (!this.player.body.touching.down) return;

		this.player.body.velocity.y = -450;
	},

	collect_item: function(player, item) {

		// add to money
		BasicGame.player_data.cash += 10;

		// remove from screen
		item.kill();

	},

	enable_room_exit: function(player, door) {

		this.can_exit_room = true;

	},

	exit_room: function() {

		if(!this.can_exit_room) return;

		//reset keys
		this.keys.up.reset();
		this.keys.down.reset();
		this.keys.left.reset();
		this.keys.right.reset();
		this.actions.a.reset();
		this.actions.s.reset();
		this.actions.d.reset();

		BasicGame.next_room_start_position = 'A';
		this.game.state.start('Dungeon');

	},

	toggle_menu: function() {

		if(this.menu) {
			this.menu.kill();
			this.menu = null;
		} else {
			this.menu = this.add.sprite(240, 160, 'Menu');
			this.menu.anchor.setTo(0.5, 0.5);
		}

	},
	
}