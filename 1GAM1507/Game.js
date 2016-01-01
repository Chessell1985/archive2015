BasicGame.Game = function(game) {

	// The player
	var player;
	var player_flipped; // change this with xScale
	var can_double_jump;
	var player_prev_x;
	var player_prev_y;
	var player_lives;
	var player_stun_timer;
	var player_stun_duration;
	var player_immune_timer;
	var player_immune_duration;
	var player_charging_energy;

	var general_wait_timer; // no duration parameter

	// the player's gun
	var bullet_cost;
	var gun_recharge_timer;
	var gun_recharge_duration;
	var fast_gun_recharge_duration;
	var fire_rate_timer;
	var fire_rate_duration;

	var shifters;
	var shifter;

	var jumpers;
	var jumper;

	var fliers;
	var flier;

	var chargers;
	var charger;

	var flingers;
	var flinger;

	var projectiles;

	var lights;

	var ends;
	var end;

	var explosions;

	var bullets;
	var bullet;

	var items;
	var item;

	var map;
	var backgroundLayer;
	var blockLayer;

	// HUD Items
	var score;
	var score_text;
	var high_score;
	var high_score_text;
	var player_hit_points;
	var player_hit_points_text;
	var charge;
	var charge_text;

	//sounds
	var shoot;
	var explode1;
	var explode2;

	//gameover

};

BasicGame.Game.prototype = {

	create: function() {

		// get high score
		this.high_score = localStorage.getItem('HighScore');
		if (this.high_score == null) {
			this.high_score = 0;
		}

		// set music
		if(BasicGame.music != null && BasicGame.music.key != 'LevelMusic') {
			BasicGame.music.stop();
			BasicGame.music = null;
		}

		if(BasicGame.music == null) {
			BasicGame.music = this.add.audio('LevelMusic', 0.5, true);
    		BasicGame.music.loop = true;
    		BasicGame.music.play();
		}

		//game over
		this.game_over = false;

    	// set sounds
		this.shoot = this.add.audio('Shoot', 0.5, false);
		this.explode1 = this.add.audio('Explode1', 0.5, false);
		this.explode2 = this.add.audio('Explode2', 0.5, false);

		// world settings
		this.world.setBounds(0, 0, 1440, 960);
		this.stage.backgroundColor = '#CCCCCC';
		this.map = this.add.tilemap('Tilemap');
    	this.map.addTilesetImage('NewTileSet', 'Tileset');
    	this.backgroundLayer = this.map.createLayer('BackgroundLayer');
    	this.blockLayer = this.map.createLayer('BlockLayer');

		// assign keys UP, A, S
		this.resetKeys();

		BasicGame.cursor_keys.up.onDown.add(function () {
			if(this.game_over == true) return;
			this.player_jump();
		}, this);

		BasicGame.letter_keys.a.onDown.add(function () {
			if(this.game_over == true) return;
			this.finishLevel();
		}, this);

		/*
		BasicGame.letter_keys.s.onDown.add(function () {
			this.shootBullet();
		}, this);
		*/
		this.fire_rate_timer = 0;
		this.fire_rate_duration = 15;

		// start ARCADE physics system
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 1000;

		// items group
		this.items = this.add.group();
		this.items.enableBody = true;
		this.items.physicsBodyType = Phaser.Physics.ARCADE;

		// lights group
		this.lights = this.add.group();
		this.lights.enableBody = true;
		this.lights.physicsBodyType = Phaser.Physics.ARCADE;

		// explosions group
		this.explosions = this.add.group();

		// bullets group
		this.bullets = this.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

		// bullet class
		Bullet = function(game, x, y) {
			Phaser.Sprite.call(this, game, x, y, 'Bullet');

			this.anchor.setTo(0.5, 0.5);

			this.bullet_timer = 45; // delay with inCamera
		};
		Bullet.prototype = Object.create(Phaser.Sprite.prototype);
		Bullet.prototype.constructor = Bullet;
		Bullet.prototype.update = function() {

			if(this.bullet_timer == 0) {
				this.kill();
			} else {
				this.bullet_timer --;
			}

		};

		// enemy groups
		this.shifters = this.add.group();
		this.shifters.enableBody = true;
		this.shifters.physicsBodyType = Phaser.Physics.ARCADE;

		// enemy groups
		this.jumpers = this.add.group();
		this.jumpers.enableBody = true;
		this.jumpers.physicsBodyType = Phaser.Physics.ARCADE;

		// enemy groups
		this.fliers = this.add.group();
		this.fliers.enableBody = true;
		this.fliers.physicsBodyType = Phaser.Physics.ARCADE;

		// enemy groups
		this.chargers = this.add.group();
		this.chargers.enableBody = true;
		this.chargers.physicsBodyType = Phaser.Physics.ARCADE;

		// enemy groups
		this.flingers = this.add.group();
		this.flingers.enableBody = true;
		this.flingers.physicsBodyType = Phaser.Physics.ARCADE;

		// enemy projectiles
		this.projectiles = this.add.group();
		this.projectiles.enableBody = true;
		this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;

		// Enemy Classes
		this.defineShifter();
		this.defineJumper();
		this.defineFlier();
		this.defineCharger();
		this.defineFlinger();

		// add items
		/*
		for(var i = 0; i < 5; i++) {
			this.item = this.items.create(320 + (i * 32), this.world.height - 128, 'Item');
		}
		*/

		// add the player
		this.player = this.add.sprite(32, this.world.height - 64, 'Player');
		this.player.anchor.setTo(0.5, 1);

		this.player.animations.add('Running');

		//this.player = this.add.sprite(32, this.world.height - 64, 'Player');
		this.player_flipped = false;
		this.player_hit_points = 5;
		this.charge = 100;
		this.player_stun_duration = 30;
		this.player_stun_timer = 0;
		this.player_immune_duration = 90;
		this.player_immune_timer = 0;
		this.can_double_jump = false;

		// gun
		this.gun_recharge_duration = 30;
		this.fast_gun_recharge_duration = 5;
		this.gun_recharge_timer = 0;
		this.bullet_cost = 4;

		// set player physics
		this.physics.arcade.enable(this.player);
		this.player.body.setSize(24, 32, 0, 0);
		this.player.body.bounce.y = 0.1;
		this.player.body.collideWorldBounds = true;
		this.map.setCollisionBetween(0, 29, true, 'BlockLayer');

		// add light
		var light = this.lights.create(240, this.world.height - 64, 'Light');
		light.body.allowGravity = false;

		// add level end
		this.ends = this.add.group();
		this.ends.enableBody = true;
		this.ends.physicsBodyType = Phaser.Physics.ARCADE;
		
		this.end = this.ends.create(this.world.width - 128, this.world.height - 64, 'End');
		this.end.body.allowGravity = false;

		// add enemy
		//this.shifter = this.shifters.add(new Shifter(this, 480, this.world.height - 64, -1));
		//this.jumper = this.jumpers.add(new Jumper(this, 960, this.world.height - 64, -1));
		this.flinger = this.flingers.add(new Flinger(this, 320, this.world.height - 64, -1));
/*
		this.flier = this.fliers.add(new Flier(this, 816, this.world.height - 228, 'left'));
		this.flier.collideWorldBounds = true;
		this.flier.body.setSize(16, 16, 0, 0);
		this.flier.body.allowGravity = false;

		this.charger = this.chargers.add(new Charger(this, 1280, this.world.height - 64, 'left'));
		this.charger.collideWorldBounds = true;
		this.charger.body.setSize(16, 16, 0, 0);
*/
		// build all HUD items and set camera
		this.buildHUD();

	},
	
	update: function() {

		if(this.game_over == false) {

			// player can land on or collide with blocks
			this.physics.arcade.collide(this.player, this.blockLayer);

			this.physics.arcade.overlap(this.player, this.lights, this.speedUpCharging, null, this);

			this.physics.arcade.overlap(this.player, this.ends, this.canEndLevel, null, this);

			// player can pick up items
			this.physics.arcade.overlap(this.player, this.items, this.collect_item, null, this);

			// player can shoot enemies
			this.physics.arcade.overlap(this.bullets, this.shifters, this.hitEnemy, null, this);
			this.physics.arcade.overlap(this.bullets, this.jumpers, this.hitEnemy, null, this);
			this.physics.arcade.overlap(this.bullets, this.flingers, this.hitEnemy, null, this);

			// player is hurt by enemies
			if(this.game_over == false) {
				this.physics.arcade.overlap(this.player, this.shifters, this.hitPlayer, null, this);
			}
			if(this.game_over == false) {
				this.physics.arcade.overlap(this.player, this.jumpers, this.hitPlayer, null, this);
			}
			if(this.game_over == false) {
				this.physics.arcade.overlap(this.player, this.flingers, this.hitPlayer, null, this);
			}
			if(this.game_over == false) {
				this.physics.arcade.overlap(this.player, this.projectiles, this.hitPlayer, null, this);
			}


			// player can move
			this.player.body.velocity.x = 0;

		}

		// player can charge energy at lights
		this.player_charging_energy = false;

		// player exits level
		this.player_can_leave = false;

		// enemies can land on or collide with blocks
		this.physics.arcade.collide(this.shifters, this.blockLayer);
		this.physics.arcade.collide(this.jumpers, this.blockLayer);
		this.physics.arcade.collide(this.flingers, this.blockLayer);

		// bullets cannot pass walls
		this.game.physics.arcade.collide(this.bullets, this.blockLayer, this.killBullet);

		if(this.player_stun_timer == 0 && this.game_over == false) {

			if (BasicGame.letter_keys.s.isDown) {
				if(this.fire_rate_timer == 0) {
					this.shootBullet();
				} else {
					this.fire_rate_timer--;
				}
			} else {
				this.fire_rate_timer = 0;
			}


			if (this.player.body.onFloor()) {
				this.can_double_jump = true;
			}

			if (BasicGame.cursor_keys.left.isDown)
		    {
		        //  Move to the left
		        this.player.body.velocity.x = -200;

		        // dash
		        if(BasicGame.letter_keys.d.isDown) {
		        	this.player.body.velocity.x = -250;
		        }

		        this.player.scale.x = -1;
		        this.player_flipped = true;

		        if(this.player.body.onFloor()) {
		        	this.player.animations.play('Running', 15, false, false);
		        } else {
		        	this.player.frame = 1;
		        }
		
		    }
		    else if (BasicGame.cursor_keys.right.isDown)
		    {
		        //  Move to the right
		        this.player.body.velocity.x = 200;

		        // dash
		        if(BasicGame.letter_keys.d.isDown) {
		        	this.player.body.velocity.x = 250;
		        }

		        this.player.scale.x = 1;
		        this.player_flipped = false;

		        if(this.player.body.onFloor()) {
		        	this.player.animations.play('Running', 15, false, false);
		        } else {
		        	this.player.frame = 1;
		        }
		    } else {
		    	if(this.player.body.onFloor()) {
		    		this.player.frame = 0;
		    	} else {
		    		this.player.frame = 1;
		    	}
		    }

		} else {
			this.player_stun_timer--;
		}

	    // count down immune timer
	    if (this.player_immune_timer > 0) {
	    	this.player_immune_timer --;
	    	if(this.player_immune_timer == 0) {
	    		this.player.alpha = 1;
	    	}
	    }

	    if (this.charge < 100) {
	    	this.gun_recharge_timer ++;
	    	if (this.player_charging_energy == false 
	    		&& this.gun_recharge_timer >= this.gun_recharge_duration)
	    	{
	    		this.charge ++;
	    		this.gun_recharge_timer = 0;
	    		this.updateEnergy();
	    	} else if (this.player_charging_energy == true
	    		&& this.gun_recharge_timer >= this.fast_gun_recharge_duration)
	    	{
	    		this.charge ++;
	    		this.gun_recharge_timer = 0;
	    		this.updateEnergy();
	    	}
	    }

	    // kill projectiles
	    this.projectiles.forEach(function(projectile) {

	    	if(!projectile.inCamera && projectile.body.velocity.y > 0) {
	    		projectile.destroy();
	    	}

	    }, this);


	},

	speedUpCharging: function() {
		this.player_charging_energy = true;
	},

	canEndLevel: function() {
		this.player_can_leave = true;
	},

	resetKeys: function() {

		// only need to reset UP, A, S
		BasicGame.cursor_keys.up.reset();
		BasicGame.letter_keys.a.reset();
		BasicGame.letter_keys.s.reset();

	},

	// Player Actions
	player_jump: function() {

		if (this.player.body.onFloor()) {
			this.player.body.velocity.y = -400;
			this.can_double_jump = true;
		} else if (this.can_double_jump) {
			this.player.body.velocity.y = -400;
			this.can_double_jump = false;
		}
	},

	collect_item: function(player, item) {

		// do something

		
		// remove from screen
		item.kill();

	},

	hitPlayer: function(player, enemy) {

		if (this.player_immune_timer > 0) {
			return;
		}

		this.player_hit_points --;
		this.updateHitPoints();

		if (this.player_hit_points > 0) {
			this.player_immune_timer = this.player_immune_duration;
			this.player_stun_timer = this.player_stun_duration;
			this.player.alpha = 0.5;
			player.body.velocity.x = 0;
			player.body.velocity.y = -200;
			return;
		}

		var x = this.player.x;
		var y = this.player.x;
		var anchorX = this.player.anchor.x;
		var anchorY = this.player.anchor.y;

		//this.player.enableBody = false;
		this.player.destroy();
		
		var explosion = this.explosions.create(x, y, 'SmallExplosion');
		this.explode2.play();
		explosion.anchor.setTo(anchorX, anchorY);

		// no frames to specify
		explosion.animations.add('Explode');
		explosion.animations.play('Explode', 15, false, true);

		this.game_over = true;
		//this.player.destroy();


		//BasicGame.transition_manager.to('MainMenu');
		//this.game.state.start('Game');

	},

	killBullet: function(bullet, blockLayer) {
		bullet.kill();
	},

	hitEnemy: function(bullet, enemy) {

		bullet.kill();

		enemy.alpha = 0.5;
		enemy.stun_timer = enemy.stun_duration;

		enemy.hit_points --;
			
		if (enemy.hit_points > 0) {
			return;
		}

		var x = enemy.x;
		var y = enemy.y;
		var anchorX = enemy.anchor.x;
		var anchorY = enemy.anchor.y;

		enemy.destroy();
		this.score += 10;
		this.updateScore();

		var explosion = this.explosions.create(x, y, 'SmallExplosion');
		this.explode1.play();
		explosion.anchor.setTo(anchorX, anchorY);

		// no frames to specify
		explosion.animations.add('Explode');
		explosion.animations.play('Explode', 15, false, true);

	},

	shootBullet: function() {

		// don't do anything if out of energy
		if(this.charge < this.bullet_cost) return;
		this.shoot.play();
		//
		if(this.player.scale.x == -1) {
			this.bullet = this.bullets.add(new Bullet(this, this.player.x - 8, this.player.y - 16));
			this.bullet.body.velocity.x = -400;
		} else {
			this.bullet = this.bullets.add(new Bullet(this, this.player.x + 8, this.player.y - 16));
			this.bullet.body.velocity.x = 400;
		}
		this.bullet.body.allowGravity = false;
		this.bullet.body.setSize(8, 8, 0, 0);
		//
		this.charge -= this.bullet_cost;
		this.fire_rate_timer = this.fire_rate_duration;
		this.updateEnergy();

	},

	finishLevel: function() {
		if(this.player_can_leave == true) {
			if (this.score > this.high_score) {
				localStorage.setItem('HighScore',this.score);
			}
			BasicGame.transition_manager.to('MainMenu');
			//this.game.state.start('MainMenu');
		}
	},

	// *** DISPLAY - SHOW ALL HUD ITEMS AND UPDATES
	buildHUD: function() {

		// set player camera
		this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

		// show score
		this.score = 0;
		this.score_text = 
		this.add.text(5, 5, "SCORE: " + this.pad(this.score, 7, "0"), 
		{font:"normal 16px Courier New",align:"left", fill:"#ffff99", stroke:"#000000", strokeThickness:6});
		this.score_text.fixedToCamera = true;
		
		// show personal best
		this.high_score_text = 
		this.add.text(5, 25, " BEST: " + this.pad(this.high_score, 7, "0"), 
		{font:"normal 16px Courier New",align:"left", fill:"#ffff99", stroke:"#000000", strokeThickness:6});
		this.high_score_text.fixedToCamera = true;

		// show hit points
		this.player_hit_points_text = 
		this.add.text(350, 5, "HEALTH: " + this.pad(this.player_hit_points, 1, "0"), 
		{font:"normal 16px Courier New",align:"left", fill:"#ffff99", stroke:"#000000", strokeThickness:6});
		this.player_hit_points_text.fixedToCamera = true;

		// show gun charge
		this.charge_text = 
		this.add.text(350, 25, "CHARGE: " + this.pad(this.charge, 3, "0") + "%", 
		{font:"normal 16px Courier New",align:"left", fill:"#ffff99", stroke:"#000000", strokeThickness:6});
		this.charge_text.fixedToCamera = true;

	},

	updateHitPoints: function() {
		this.player_hit_points_text.setText("HEALTH: " + this.pad(this.player_hit_points, 1, "0"));
	},

	updateScore: function() {
		this.score_text.setText("SCORE: " + this.pad(this.score, 7, "0"));
	},

	updateEnergy: function() {
		this.charge_text.setText("CHARGE: " + this.pad(this.charge, 3, "0") + "%");
	},

	pad: function(n, w, z) {
		z = z || "0";
		n = n + "";
		return n.length >= w ? n : new Array(w - n.length + 1).join(z) + n;		
	},

	// *** ENEMY CLASSES - CALLED BY CREATE FUNCTION

	// SHIFTER - Shuffles left or right
	defineShifter: function() {

		Shifter = function(game, x, y, direction) {

			Phaser.Sprite.call(this, game, x, y, 'Shifter');
			this.anchor.setTo(0.5, 1);
			this.scale.x =  direction;

			// attributes
			this.active        =      false; // becomes active when spotted
			this.move_timer    =          0; // move timer
			this.move_duration =         60; // how long to move?
			this.move_direction = direction; // which direction to move?
			this.move_speed_x  =        100; // move speed
			this.move_speed_y  =          0; // jump speed
			this.wait_timer    =          0; // wait timer
			this.wait_duration =         30; // how long to wait?
			this.hit_points    =          3;
			this.stun_timer    =          0;
			this.stun_duration =         30;

			// for setting physics properties
			this.initiated_physics =  false;

		};

		Shifter.prototype = Object.create(Phaser.Sprite.prototype);
		Shifter.prototype.constructor = Shifter;
		Shifter.prototype.update = function() {

			// initiate physics
			if(!this.initiated_physics) {

				this.body.collideWorldBounds = true;
				this.body.setSize(32, 32, 0, 0);
				this.initiated_physics = true;

			}

			// activate
			if(this.inCamera && !this.active) this.active = true;
			
			// move pattern
			if(this.active) {

				if(this.stun_timer == 0) {
					this.alpha = 1.0;
				} else {
					this.stun_timer--;
				}

				if(this.body.onWall()) {

					this.move_direction *= -1;
					this.body.velocity.x *= -1;

				}

				if(this.wait_timer == 0 && this.move_timer == 0) {

					this.body.velocity.x =  (this.move_speed_x * this.move_direction);
					this.scale.x = this.move_direction;
					
					this.move_timer = this.move_duration;

				} else if(this.move_timer > 0) {

					this.move_timer --;

					if(this.move_timer == 0) {
						this.body.velocity.x = 0;
						this.wait_timer = this.wait_duration;
					}

				} else {

					this.wait_timer --;

				}
			}

		};

	},

	// JUMPER - Jumps left or right
	defineJumper: function() {
	
		Jumper = function(game, x, y, direction) {
				
			Phaser.Sprite.call(this, game, x, y, 'Jumper');
			this.anchor.setTo(0.5, 1);
			this.scale.x =  direction;

			// attributes
			this.active        =      false; // becomes active when spotted
			this.move_timer    =          0; // move timer
			this.move_duration =        120; // how long to move?
			this.move_direction = direction; // which direction to move?
			this.move_speed_x  =        100; // move speed
			this.move_speed_y  =       -400; // jump speed
			this.wait_timer    =          0; // wait timer
			this.wait_duration =          0; // how long to wait?
			this.hit_points    =          3;
			this.stun_timer    =          0;
			this.stun_duration =         30;

			// for setting physics properties
			this.initiated_physics =  false;

		};
		Jumper.prototype = Object.create(Phaser.Sprite.prototype);
		Jumper.prototype.constructor = Jumper;
		Jumper.prototype.update = function() {

			if (!this.initiated_physics) {

				this.body.collideWorldBounds = true;
				this.body.setSize(28, 28, 0, 0);
				this.initiated_physics = true;

			}

			// activate
			if(this.inCamera && !this.active) this.active = true;
			
			// move pattern
			if(this.active) {

				if(this.stun_timer == 0) {
					this.alpha = 1.0;
				} else {
					this.stun_timer--;
				}

				if(this.body.onWall()) {

					this.move_direction *= -1;
					this.body.velocity.x *= -1;

				}

				if(this.wait_timer == 0 && this.move_timer == 0) {

					this.body.velocity.x =  (this.move_speed_x * this.move_direction);
					this.scale.x = this.move_direction; 

					this.body.velocity.y = this.move_speed_y;
					this.move_timer = this.move_duration;

				} else if(this.move_timer > 0) {

					this.move_timer --;
					if(this.move_timer == 0 || this.body.onFloor()) {

						this.move_timer = 0;
						this.body.velocity.x = 0;
						this.wait_timer = this.wait_duration;

					}

				} else {

					this.wait_timer --;

				}
			}

		};

	},

	// FLINGER - flings projectiles at player, doesn't move
	defineFlinger: function() {

		Flinger = function(game, x, y, direction) {

			Phaser.Sprite.call(this, game, x, y, 'Flinger');
			this.anchor.setTo(0.5, 1);
			this.scale.x =  direction;

			// attributes
			this.active        =      false; // becomes active when spotted
			this.move_timer    =          0; // move timer
			this.move_duration =          0; // how long to move?
			this.move_direction = direction; // which direction to move?
			this.move_speed_x  =          0; // move speed
			this.move_speed_y  =          0; // jump speed
			this.wait_timer    =          0; // wait timer
			this.wait_duration =         30; // how long to wait?
			this.hit_points    =          5;
			this.stun_timer    =          0;
			this.stun_duration =         30;

			// for setting physics properties
			this.initiated_physics =  false;

			// projectiles
			this.projectile = null;

		};

		Flinger.prototype = Object.create(Phaser.Sprite.prototype);
		Flinger.prototype.constructor = Flinger;
		Flinger.prototype.update = function() {

			// initiate physics
			if(!this.initiated_physics) {

				this.body.collideWorldBounds = true;
				this.body.setSize(32, 32, 0, 0);
				this.initiated_physics = true;

			}

			// activate
			if(this.inCamera && !this.active) this.active = true;
			
			// move pattern
			if(this.active) {

				if(this.stun_timer == 0) {
					this.alpha = 1.0;
				} else {
					this.stun_timer--;
				}

				if(this.x > this.game.player.x) {
					this.scale.x = -1;
				} else {
					this.scale.x = 1;
				}

				if(this.wait_timer == 0) {

					var velocityX = this.game.rnd.integerInRange(1,3);
					var velocityY = this.game.rnd.integerInRange(1,3);

					this.projectile = this.game.projectiles.create(this.x, this.y - 16, 'Projectile');
					this.projectile.anchor.setTo(0.5, 0.5);
					this.projectile.body.velocity.x = (velocityX * 50) * this.scale.x;
					this.projectile.body.velocity.y = -600;

					this.wait_timer = this.wait_duration;

				} else {
					this.wait_timer--;
				}

			}

		};

	},

	// FLIER - Flies at player - Not In Use
	defineFlier: function() {
	
		Flier = function(game, x, y, direction) {
				
			Phaser.Sprite.call(this, game, x, y, 'Flier');
			this.anchor.setTo(0.5, 1);
			this.scale.x =  direction;

			// attributes
			this.active        =      false; // becomes active when spotted
			this.move_timer    =          0; // move timer
			this.move_duration =          0; // how long to move?
			this.move_direction = direction; // which direction to move?
			this.move_speed_x  =          0; // move speed
			this.move_speed_y  =          0; // jump speed
			this.wait_timer    =          0; // wait timer
			this.wait_duration =          0; // how long to wait?
			this.hit_points    =          1;
			this.stun_timer    =          0;
			this.stun_duration =         30;

		};
		Flier.prototype = Object.create(Phaser.Sprite.prototype);
		Flier.prototype.constructor = Flier;
		Flier.prototype.update = function() {

			// will not move unless player is nearby
			if((this.x > this.game.player.x && this.x - this.game.player.x < 240) // player approaches from the left 
				|| (this.x < this.game.player.x && this.x - this.game.player.x > -240)) // approaches from the right
			{
				this.active = true;	
			}
			
			// move pattern
			if(this.active) {

				if(this.stun_timer == 0) {
					this.alpha = 1.0;
				} else {
					this.stun_timer--;
				}

				// move towards player and hang around them
				if (this.x > this.game.player.x && this.x - this.game.player.x > 16) {
					this.body.velocity.x = -200;
				} else if (this.x < this.game.player.x && this.x - this.game.player.x < -16) {
					this.body.velocity.x = 200;
				} else {
					this.body.velocity.x = 0;
				}
				if (this.y > this.game.player.y && this.y - this.game.player.y > 16) {
					this.body.velocity.y = -200;
				} else if (this.y < this.game.player.y && this.y - this.game.player.y < -16) {
					this.body.velocity.y = 200;
				} else {
					this.body.velocity.y = 0;
				}

			}

		};

	},

	// CHARGERS - Charges at player - Not In Use
	defineCharger: function() {
	
		Charger = function(game, x, y, direction) {
				
			Phaser.Sprite.call(this, game, x, y, 'Charger');
			this.anchor.setTo(0.5, 1);
			this.scale.x =  direction;

			// attributes
			this.active        =      false; // becomes active when spotted
			this.move_timer    =          0; // move timer
			this.move_duration =          0; // how long to move?
			this.move_direction = direction; // which direction to move?
			this.move_speed_x  =        240; // move speed
			this.move_speed_y  =          0; // jump speed
			this.wait_timer    =          0; // wait timer
			this.wait_duration =         60; // how long to wait?
			this.hit_points    =          5;
			this.stun_timer    =          0;
			this.stun_duration =         30;

			// for setting physics properties
			this.initiated_physics =  false;

		};
		Charger.prototype = Object.create(Phaser.Sprite.prototype);
		Charger.prototype.constructor = Charger;
		Charger.prototype.update = function() {

			if (!this.initiated_physics) {

				this.body.collideWorldBounds = true;
				this.body.setSize(32, 32, 0, 0);
				this.initiated_physics = true;

			}

			// activate
			if(this.inCamera && !this.active) this.active = true;
			
			// move
			if(this.active) {

				if(this.stun_timer == 0) {
					this.alpha = 1.0;
				} else {
					this.stun_timer--;
				}

				f((this.x > this.game.player.x && this.x - this.game.player.x < 180)
					|| (this.game.player.x > this.x && this.game.player.x - this.x < 180))
				{
					if(this.body.velocity.x == 0) {
						if(this.x > this.game.player.x) {
							this.body.velocity.x = -225;
							this.scale.x = -1;
						} else {
							this.body.velocity.x = 225;
							this.scale.x = 1;
						}
					} else {
						if(this.x < this.game.player.x && this.body.velocity.x < 0) {

						}
					}
				}

			}

		};

	},
	
}