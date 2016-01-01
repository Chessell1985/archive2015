BasicGame.Game = function(game) {

	var map, backgroundlayer, blocklayer;

	var player, player_jumping, player_shoot_wait, player_shoot_wait_duration,
	player_charge, player_charge_wait, player_charge_wait_duration, player_jump_timer,
	player_pressing_jump;

	var bullets, bullet;

	var charge_meter, charge_gauge;
	var health_meter, health_gauge;

	var enemies, enemy;

	var light_sources, light_source;

};

BasicGame.Game.prototype = {

	create: function() {

		// world settings
		this.world.setBounds(0, 0, 2400, 288);
		this.stage.backgroundColor = '#FF9900';
		this.map = this.add.tilemap('Tilemap');
    	this.map.addTilesetImage('tileset_1', 'Tileset');
    	this.backgroundlayer = this.map.createLayer('backgroundlayer');
    	this.blocklayer = this.map.createLayer('blocklayer');

    	// Add physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		//this.physics.arcade.gravity.y = 900;
		this.map.setCollisionBetween(0, 49, true, 'blocklayer');

		// assign keys
		this.resetKeys();

		this.light_sources = this.add.group();

		// bullets group
		this.bullets = this.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

		// bullet
		this.defineBullet();

		// add enemy
		this.enemies = this.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
		//this.enemy = this.enemies.add(new OrangeJumper(this.game, 144, 80, -1));
		this.createEnemies();

		// create player
		this.player = this.add.sprite(16, this.world.height - 32, 'Player');
		this.player.anchor.setTo(0.5, 0.5);

		// Add player physics
		this.physics.arcade.enable(this.player);
		this.player.body.setSize(12, 24, 0, 0);
		this.player.body.collideWorldBounds = true;
		this.player.body.gravity.y = 900;

		// player animations
		this.player.animations.add('Running');

		// player variables
		this.player_shoot_wait = 0;
		this.player_shoot_wait_duration = 10;
		this.player_charge = 100;
		this.player_charge_wait = 0;
		this.player_charge_wait_duration = 120;
		this.player_health = 100;
		this.player_jump_timer = 0;
		this.player_pressing_jump = false;

		this.camera.x = 0;
		this.camera.y = 144;

		//this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

		// player charge meter
		this.charge_gauge = this.add.sprite(2, 2, 'ChargeMeter');
		this.charge_gauge.fixedToCamera = true;
		this.charge_meter = this.add.group();

		// player charge meter
		this.health_gauge = this.add.sprite(2, 14, 'HealthMeter');
		this.health_gauge.fixedToCamera = true;
		this.health_meter = this.add.group();

	},
	
	update: function() {

		// player can land on or collide with blocks
		this.physics.arcade.collide(this.player, this.blocklayer);

		// enemy can land on or collide with blocks
		this.physics.arcade.collide(this.enemies, this.blocklayer);

		// Initialise Velocity
		this.player.body.velocity.x = 0;

		// player up movement
		if (BasicGame.cursor_keys.up.isDown && this.player.body.onFloor()
			&& !this.player_pressing_jump) 
		{
			
			this.player.body.velocity.y = -210;
			this.player_jump_timer = 1;
			this.player_pressing_jump = true;

		}
		else if(BasicGame.cursor_keys.up.isDown && this.player_jump_timer !== 0)
		{

			if(this.player_jump_timer >= 12) {

				this.player_jump_timer = 0;

			} else {

				this.player.body.velocity.y = -210;
				this.player_jump_timer ++;

			}

		}
		else if(this.player_jump_timer !== 0)
		{

			this.player_jump_timer = 0;

		}
		else if(!BasicGame.cursor_keys.up.isDown && this.player.body.onFloor())
		{

			this.player_pressing_jump = false;

		}

		// player left/right movement
		if (BasicGame.cursor_keys.left.isDown)
	    {
	        // face left
	        this.player.scale.x = -1;
			
			// Move left
			this.player.body.velocity.x = -80;

	        if(this.player.body.onFloor()) {

	        	// running
	        	this.player.animations.play('Running', 15, true, false);

	        } else {

	        	// jumping/falling
	        	this.player.frame = 1;
	        	this.player.animations.stop(null, false);

	        }
	
	    }
	    else if (BasicGame.cursor_keys.right.isDown)
	    {
	        // face right
	        this.player.scale.x = 1;

	        // Move right
	        this.player.body.velocity.x = 80;

	        if(this.player.body.onFloor()) {

	        	// running
	        	this.player.animations.play('Running', 15, true, false);

	        } else {

	        	// jumping/falling
	        	this.player.frame = 1;
	        	this.player.animations.stop(null, false);

	        }
	    } 
	    else 
	    {

	    	// resolves blurring due to pixel hack
	    	this.player.x = Math.floor(this.player.x);

	    	if(this.player.body.onFloor()) {

	    		// standing
	    		this.player.frame = 0;
	        	this.player.animations.stop(null, false);

	    	} else {

	    		// jumping/falling
	    		this.player.frame = 1;
	        	this.player.animations.stop(null, false);

	    	}
	    }


		if (BasicGame.letter_keys.s.isDown) {

			if(this.player_shoot_wait === 0) {

				this.shootBullet();

			} else {

				this.player_shoot_wait--;

			}

		} else {

			this.player_shoot_wait = 0;

		}

		if(this.player_charge != 100 && !BasicGame.letter_keys.s.isDown) {

			if(this.player_charge_wait === 0) {

				this.player_charge_wait = this.player_charge_wait_duration;
				this.player_charge += 10;

				if(this.player_charge > 100) {

					this.player_charge = 100;

				}

			} else {

				this.player_charge_wait --;

			}

		}

		if(!this.player.inCamera) {

			if (this.player.x > (this.camera.x + this.camera.width)) 
			{

				this.camera.x += 160;

			}
			else if (this.player.x < (this.camera.x))
			{

				this.camera.x -= 160;

			}

			if (this.player.y > (this.camera.y + this.camera.width))
			{

				this.camera.y += 144;

			}
			else if(this.player.y < (this.camera.y)) 
			{

				this.camera.y -= 144;

			}

		}

		this.updateChargeMeter();
		this.updateHealthMeter();

	},

	updateChargeMeter: function() {

		var charge_unit;
		var units_left = Math.floor(this.player_charge / 10);
		
		this.charge_meter.forEach(function(charge_unit) {

			charge_unit.destroy();

		}, this);

		for(var i = 0; i < units_left; i++) {

			charge_unit = this.charge_meter.create(13 + (i * 4), 5, 'ChargeUnit');
			charge_unit.fixedToCamera = true;

		}

	},

	updateHealthMeter: function() {

		var health_unit;
		var units_left = Math.floor(this.player_health / 10);

		this.health_meter.forEach(function(health_unit) {

			health_unit.destroy();

		}, this);

		for(var i = 0; i < units_left; i++) {

			health_unit = this.health_meter.create(13 + (i * 4), 17, 'HealthUnit');
			health_unit.fixedToCamera = true;

		}

	},

	createEnemies: function() {
		this.map.objects['objectlayer'].forEach(function(element) {
			if(element.name === 'LightSource') 
			{
				this.light_source = this.light_sources.create(element.x + 8, element.y - 24, 'LightSource');
				this.light_source.animations.add('Flash');
				this.light_source.animations.play('Flash', 10, true, false);
			}
			else if(element.name === 'OrangeJumper') 
			{
				this.enemies.add(new OrangeJumper(this.game, element.x + 8, element.y - 8, element.properties.Facing));
			}
		}, this);
	},

	defineBullet: function() {

		Bullet = function(game, x, y) {
			Phaser.Sprite.call(this, game, x, y, 'Bullet');

			this.anchor.setTo(0.5, 0.5);

			this.bullet_timer = 45; // delay with inCamera

			this.initiated_physics = false;
		};
		Bullet.prototype = Object.create(Phaser.Sprite.prototype);
		Bullet.prototype.constructor = Bullet;
		Bullet.prototype.update = function() {

			// initiate physics
			if(!this.initiated_physics) {

				this.body.allowGravity = false;
				this.body.setSize(4, 4, 0, 0);
				this.initiated_physics = true;

				if(this.game.player.scale.x === -1) {

					// shoot left
					this.body.velocity.x = -200;

				} else {

					// shoot right
					this.body.velocity.x =  200;

				}

			}

			if(this.bullet_timer == 0) {

				this.destroy();

			} else {

				this.bullet_timer --;

			}

		};

	},

	shootBullet: function() {

		if(this.player_charge < 10) {

			return;

		}

		// create bullet
		this.bullet = this.bullets.add(new Bullet(this, this.player.x, this.player.y + 2));

		// wait for next bullet
		this.player_charge -= 5;
		this.updateChargeMeter();
		this.player_shoot_wait = this.player_shoot_wait_duration;

	},
	
	render: function() {

		//  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
    	BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, 
    		this.game.width, this.game.height, 0, 0, BasicGame.pixel.width, BasicGame.pixel.height);

	},
	
	pad: function(n, w, z) {
		z = z || "0";
		n = n + "";
		return n.length >= w ? n : new Array(w - n.length + 1).join(z) + n;		
	},

	resetKeys: function() {

		BasicGame.cursor_keys.up.reset();
		BasicGame.letter_keys.a.reset();

	},
	
}