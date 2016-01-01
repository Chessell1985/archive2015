BasicGame.Game2 = function(game) {

	// The player
	var player;
	var player_in_light;

	// Enemies
	var enemies;
	var flying_enemies;
	var enemy;
	var projectiles;

	// bullets
	var bullets;
	var bullet_cost;
	var recharge_timer;
	var recharge_duration;

	// light sources
	var light_sources;
	var light_source;
	var life_packs;
	var life_pack;

	// Tilemap
	var map;
	var backgroundLayer;
	var blockLayer;

	// Sounds
	var sound_explode_1;
	var sound_explode_2;
	var sound_explode_3;
	var sound_shoot;
	var sound_hit;
	var sound_collect;
	var sound_jump;

	// HUD Items
	var score;
	var score_text;
	var high_score;
	var high_score_text;
	var player_hit_points;
	var player_hit_points_text;
	var charge;
	var charge_text;

	var text;

	// Game Over switch
	var game_over;
	var game_over_timer;
	var game_over_duration;

	// End level switch
	var level_over;
	var level_over_timer;
	var level_over_duration;

	var level_bonus;
	var level_bonus_timer;

};

BasicGame.Game2.prototype = {

	create: function() {

		this.level_bonus = 10800;
		this.level_bonus_timer = 0;

		// game over switch
		this.game_over = false;
		this.game_over_duration = 240;
		this.game_over_timer = 0;

		// level over switch
		this.level_over = false;
		this.level_over_duration = 240;
		this.level_over_timer = 0;

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

		// sounds
		this.sound_explode_1 = this.add.audio('Explode1', 0.5, false);
		this.sound_explode_2 = this.add.audio('Explode2', 0.5, false);
		this.sound_explode_3 = this.add.audio('Explode3', 0.5, false);
		this.sound_shoot = this.add.audio('Shoot', 0.5, false);
		this.sound_hit = this.add.audio('Hit', 0.25, false);
		this.sound_collect = this.add.audio('Collect', 0.5, false);
		this.sound_jump = this.add.audio('Jump', 0.25, false);

		// world settings
		this.world.setBounds(0, 0, 4800, 640);
		this.stage.backgroundColor = '#CCCCCC';
		this.map = this.add.tilemap('Tilemap');
    	this.map.addTilesetImage('NewTileSet', 'Tileset');
    	this.backgroundLayer = this.map.createLayer('BackgroundLayer');
    	this.blockLayer = this.map.createLayer('BlockLayer');

		// assign keys UP, A, S
		this.resetKeys();

		BasicGame.cursor_keys.up.onDown.add(function () {

			this.playerJump();

		}, this);

		// Add physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 1000;
		this.map.setCollisionBetween(0, 29, true, 'BlockLayer');

		// create light sources
		this.light_sources = this.add.group();
		this.light_sources.enableBody = true;
		this.light_sources.physicsBodyType = Phaser.Physics.ARCADE;
		this.life_packs = this.add.group();
		this.life_packs.enableBody = true;
		this.life_packs.physicsBodyType = Phaser.Physics.ARCADE;

		this.createItems();

		// Create Enemies
		this.enemies = this.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
		this.flying_enemies = this.add.group();
		this.flying_enemies.enableBody = true;
		this.flying_enemies.physicsBodyType = Phaser.Physics.ARCADE;
		this.projectiles = this.add.group();
		this.projectiles.enableBody = true;
		this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;

		this.defineShifter();
		this.defineFlinger();
		this.defineJumper();
		this.defineCharger();
		this.defineFlier();
		this.defineBoss();

		//this.enemy = this.enemies.add(new Shifter(this, 1248, 256, 1));
		this.createEnemies();

		//this.enemy = this.enemies.add(new Flinger(this, 3776, 192, -1));
		
		//this.enemy = this.enemies.add(new Jumper(this, 3296, 256, -1));

		//this.enemy = this.enemies.add(new Charger(this, 1400, this.world.height - 64, -1));

		//this.enemy = this.flying_enemies.add(new Flier(this, 480, this.world.height - 320, -1));

		//this.enemy = this.enemies.add(new Boss(this, this.world.width - 96, this.world.height - 160, -1));

		// create bullets
		this.bullets = this.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

		this.defineBullet();
		this.bullet_cost = 5;
		this.shoot_wait_timer = 0;
		this.shoot_wait_duration = 15;
		this.recharge_timer = 0;
		this.recharge_duration = 30;
		this.fast_recharge_duration = 5;
		this.player_in_light = false;

		// Create the player
		this.createPlayer();

		// HUD related variables
		this.score = 0;
		this.high_score = localStorage.getItem('HighScore');
		if (this.high_score == null) {
			this.high_score = 0;
		}
		this.player_hit_points = 10;
		this.charge = 100;

		// build HUD
		this.buildHUD();

	},
	
	update: function() {

		if(this.level_bonus > 0) {
			this.level_bonus--;
		}

		// player can land on or collide with blocks
		this.physics.arcade.collide(this.player, this.blockLayer);
		// so can enemies
		this.physics.arcade.collide(this.enemies, this.blockLayer);
		// enemies can be shot
		this.physics.arcade.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
		this.physics.arcade.overlap(this.bullets, this.flying_enemies, this.hitEnemy, null, this);

		// control player
		this.playerMovement();
		this.playerShoot();

		// check for stun
		this.playerStun();

		// check charge
		this.playerRecharge();

		// check for collisions with other objects
		this.playerCollisions();

		// kill projectiles
		this.killProjectiles();

		// check for game over
		this.gameOver();

		// check for level over
		this.levelOver();

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

	// *** Tilemap Integration - Create objects from tiled File
	createItems: function() {
		console.log("searching objects");

		this.map.objects['ObjectLayer'].forEach(function(element) {
			//console.log(element);

			if(element.name === 'Light') 
			{
				this.light_source = this.light_sources.create(element.x, element.y - 32, 'Light');
				this.light_source.body.allowGravity = false;
			}
			else if(element.name === 'LifePack') 
			{
				this.life_pack = this.life_packs.create(element.x, element.y - 32, 'LifePack');
				this.life_pack.body.allowGravity = false;
			}
		}, this);
	},

	createEnemies: function() {
		console.log("searching objects");

		this.map.objects['ObjectLayer'].forEach(function(element) {
			//console.log(element);

			if(element.name === 'Shifter') 
			{
				this.enemies.add(new Shifter(this, element.x + 16, element.y, element.properties.Facing));
			}
			else if(element.name === 'Jumper')
			{
				this.enemies.add(new Jumper(this, element.x + 16, element.y, element.properties.Facing));
			}
			else if(element.name === 'Flinger')
			{
				this.enemies.add(new Flinger(this, element.x + 16, element.y, element.properties.Facing));
			}
			else if(element.name === 'Charger')
			{
				this.enemies.add(new Charger(this, element.x + 16, element.y, element.properties.Facing));
			}
			else if(element.name === 'Flier')
			{
				this.enemies.add(new Flier(this, element.x + 16, element.y, element.properties.Facing));
			}
			else if(element.name === 'Boss')
			{
				this.enemies.add(new Boss(this, element.x + 64, element.y, element.properties.Facing));
			}
		}, this);
	},

	// *** PLAYER - All player actions go here
	createPlayer: function() {

		// Add the player
		this.player = this.add.sprite(0 + 64, 640 - 64, 'Player');
		this.player.anchor.setTo(0.5, 1);

		// Add player physics
		this.physics.arcade.enable(this.player);
		this.player.body.setSize(24, 32, 0, 0);
		this.player.body.bounce.y = 0.1;
		this.player.body.collideWorldBounds = true;

		// Add player animations
		this.player.animations.add('Running');

		// Player variables
		this.can_double_jump = false;
		this.player_stun_timer = 0;
		this.player_stun_duration = 60;

	},

	hitPlayer: function() {

		// don't hit if game over
		if(this.game_over == true) return;

		// don't hit if stunned
		if(this.player_stun_timer > 0) return;

		// destroy instead if 1 hp left
		if(this.player_hit_points == 1) {

			this.destroyPlayer();
			return;

		}

		//play sound
		this.sound_hit.play();

		// Affect hit points
		this.player_hit_points--;
		this.updateHitPoints();

		// Inflict Stun
		this.player.alpha = 0.5;
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = -200;

		// Set Stun Timer
		this.player_stun_timer = this.player_stun_duration;

	},

	healPlayer: function(player, item) {

		// don't heal if game over
		if(this.game_over == true) return;

		// ignore if full health
		//if(this.player_hit_points === 10) return;
		this.sound_collect.play();

		// reset health
		this.player_hit_points = 10;
		this.updateHitPoints();
		item.kill();

	},

	destroyPlayer: function() {

		// Destroy once only
		if(this.game_over == true) return;

		// Affect hit points
		this.player_hit_points--;
		this.updateHitPoints();

		// get position of player
		var x = this.player.x;
		var y = this.player.y;
		var anchorX = this.player.anchor.x;
		var anchorY = this.player.anchor.y;

		// destroy!
		this.player.kill();

		// play sound
		this.sound_explode_2.play();
		
		// create explosion
		var explosion = this.add.sprite(x, y, 'SmallExplosion');
		explosion.anchor.setTo(anchorX, anchorY);
		explosion.animations.add('Explode');
		explosion.animations.play('Explode', 15, false, true);

		// game over
		this.game_over = true;
		this.game_over_timer = this.game_over_duration;
		this.text = 
			this.add.text(240, 120, "GAME OVER", 
			{font:"normal 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000000", strokeThickness:6});
		this.text.anchor.setTo(0.5, 0.5);
		this.text.fixedToCamera = true;

		if(this.score > this.high_score) {

			this.text = 
				this.add.text(240, 180, "NEW HIGH SCORE!", 
				{font:"normal 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000000", strokeThickness:6});
			this.text.anchor.setTo(0.5, 0.5);
			this.text.fixedToCamera = true;

			localStorage.setItem('HighScore',this.score);

		}

	},

	playerStun: function() {

		// Remove stun if timer hits zero
		if(this.player_stun_timer == 0) {

			this.player.alpha = 1.0;
			return;

		}

		// Affect stun timer
		this.player_stun_timer--;

	},

	playerCollisions: function() {

		// No collision if game over
		if(this.game_over == true) return;

		// hit player if collide with enemy
		this.physics.arcade.overlap(this.player, this.enemies, this.hitPlayer, null, this);

		// hit player if collide with flying enemy
		this.physics.arcade.overlap(this.player, this.flying_enemies, this.hitPlayer, null, this);

		// hit player if collide with projectile
		this.physics.arcade.overlap(this.player, this.projectiles, this.hitPlayer, null, this);

		// player picks up health packs
		this.physics.arcade.overlap(this.player, this.life_packs, this.healPlayer, null, this);

	},

	playerMovement: function() {
		
		// Don't move if game over
		if(this.game_over == true) return;

		// Initialise Velocity
		this.player.body.velocity.x = 0;

		// Double jump switch
		if (this.player.body.onFloor()) {
			this.can_double_jump = true;
		}

		if (BasicGame.cursor_keys.left.isDown)
	    {
	        // face left
	        this.player.scale.x = -1;
			
			// Move left
			if(BasicGame.letter_keys.d.isDown) {

	        	this.player.body.velocity.x = -250;

	        } else {

	        	this.player.body.velocity.x = -200;

	        }

	        if(this.player.body.onFloor()) {

	        	// running
	        	this.player.animations.play('Running', 15, false, false);

	        } else {

	        	// jumping/falling
	        	this.player.frame = 1;

	        }
	
	    }
	    else if (BasicGame.cursor_keys.right.isDown)
	    {
	        // face right
	        this.player.scale.x = 1;

	        // Move right
			if(BasicGame.letter_keys.d.isDown) {

	        	this.player.body.velocity.x = 250;

	        } else {

	        	this.player.body.velocity.x = 200;

	        }

	        if(this.player.body.onFloor()) {

	        	// running
	        	this.player.animations.play('Running', 15, false, false);

	        } else {

	        	// jumping/falling
	        	this.player.frame = 1;

	        }
	    } 
	    else 
	    {
	    	if(this.player.body.onFloor()) {

	    		// standing
	    		this.player.frame = 0;

	    	} else {

	    		// jumping/falling
	    		this.player.frame = 1;

	    	}
	    }
	},

	playerJump: function() {

		//Don't move if game over
		if(this.game_over == true) return;

		if (this.player.body.onFloor()) {
			this.sound_jump.play();

			this.player.body.velocity.y = -400;
			this.can_double_jump = true;

		} else if (this.can_double_jump) {
			this.sound_jump.play();

			this.player.body.velocity.y = -400;
			this.can_double_jump = false;

		}
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
				this.body.setSize(8, 8, 0, 0);
				this.initiated_physics = true;

			}

			if(this.bullet_timer == 0) {

				this.destroy();

			} else {

				this.bullet_timer --;

			}

		};

	},

	playerShoot: function() {

		if (BasicGame.letter_keys.s.isDown) {

			if(this.shoot_wait_timer == 0) {

				this.shootBullet();

			} else {

				this.shoot_wait_timer--;

			}

		} else {

			this.shoot_wait_timer = 0;

		}

	},

	shootBullet: function() {

		// don't do anything if out of energy
		if(this.charge < this.bullet_cost) return;

		// play sound
		this.sound_shoot.play();

		if(this.player.scale.x == -1) {

			// shoot left
			this.bullet = this.bullets.add(new Bullet(this, this.player.x - 8, this.player.y - 16));
			this.bullet.body.velocity.x = -400;

		} else {

			// shoot right
			this.bullet = this.bullets.add(new Bullet(this, this.player.x + 8, this.player.y - 16));
			this.bullet.body.velocity.x = 400;

		}

		// bullet physics
		this.bullet.body.allowGravity = false;
		this.bullet.body.setSize(8, 8, 0, 0);

		// update charge
		this.charge -= this.bullet_cost;
		this.shoot_wait_timer = this.shoot_wait_duration;
		this.updateEnergy();

	},

	playerRecharge: function() {

	    if (this.charge < 100) {

	    	this.player_in_light = false;

	    	this.physics.arcade.overlap(this.player, this.light_sources, this.fasterCharge, null, this);

	    	if (this.player_in_light == false && this.recharge_timer == 0)
	    	{

	    		this.charge ++;
	    		this.recharge_timer = this.recharge_duration;
	    		this.updateEnergy();

	    	} 
	    	else if ((this.player_in_light == true && this.recharge_timer == 0) 
	    		|| (this.player_in_light && this.recharge_timer > this.fast_recharge_duration))
	    	{

	    		this.charge ++;
	    		this.recharge_timer = this.fast_recharge_duration;
	    		this.updateEnergy();

	    	}
	    	else
	    	{
	    		this.recharge_timer--;
	    	}

	    }

	},

	fasterCharge: function() {
		this.player_in_light = true;
	},

	hitEnemy: function(bullet, enemy) {

		// destroy bullet
		bullet.kill();

		if(enemy.hit_points == 1) {

			this.destroyEnemy(enemy);
			return;

		}

		// play sound
		this.sound_hit.play();

		// Affect hit points
		enemy.hit_points --;

		// Inflict stun
		enemy.alpha = 0.5;

		// Set Stun Timer
		enemy.stun_timer = enemy.stun_duration;

	},

	destroyEnemy: function(enemy) {

		// update score
		this.score += enemy.score_points;
		this.updateScore();

		// end level?
		if(enemy.is_boss == true) {

			this.endLevel();
			this.sound_explode_3.play();

		} else {

			this.sound_explode_1.play();

		}

		// get position of player
		var x = enemy.x;
		var y = enemy.y;
		var anchorX = enemy.anchor.x;
		var anchorY = enemy.anchor.y;

		// destroy!
		enemy.destroy();
		
		// create explosion
		var explosion = this.add.sprite(x, y, 'SmallExplosion');
		explosion.anchor.setTo(anchorX, anchorY);
		explosion.animations.add('Explode');
		explosion.animations.play('Explode', 15, false, true);

	},

	gameOver: function() {

		// exit if not game over
		if(this.game_over == false) return;

		if(this.game_over_timer == 0) {

			// exit when timer runs out
			BasicGame.transition_manager.to('MainMenu');

		} else {

			this.game_over_timer--;

		}

	},

	endLevel: function() {

		this.level_over = true;
		this.level_over_timer = this.level_over_duration;
		this.text = 
			this.add.text(240, 120, "LEVEL FINISHED", 
			{font:"normal 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000000", strokeThickness:6});
		this.text.anchor.setTo(0.5, 0.5);
		this.text.fixedToCamera = true;

		if(this.level_bonus > 0) {
			this.text = 
				this.add.text(240, 150, "TIME BONUS: +" + this.level_bonus, 
				{font:"normal 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000000", strokeThickness:6});
			this.text.anchor.setTo(0.5, 0.5);
			this.text.fixedToCamera = true;

			this.score += this.level_bonus;
		}

		if(this.score > this.high_score) {

			this.text = 
				this.add.text(240, 200, "NEW HIGH SCORE!", 
				{font:"normal 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000000", strokeThickness:6});
			this.text.anchor.setTo(0.5, 0.5);
			this.text.fixedToCamera = true;

			localStorage.setItem('HighScore',this.score);

		}

	},

	levelOver: function() {

		// exit if not over
		if(this.level_over == false) return;

		if(this.level_over_timer == 0) {

			//exit when timer runs out
			BasicGame.transition_manager.to('Credits');

		} else {

			this.level_over_timer--;

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

	// *** ENEMY CLASSES - CALLED BY CREATE FUNCTION
	killProjectiles: function() {

		this.projectiles.forEach(function(projectile) {

			if(projectile.y > this.player.y && projectile.y - this.player.y > 320) {

				projectile.kill();

			}

		}, this);

	},

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
			this.score_points  =         10; 
			this.is_boss       =      false;

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
			this.score_points  =         15; 
			this.is_boss       =      false;

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
			this.hit_points    =          3;
			this.stun_timer    =          0;
			this.stun_duration =         30;
			this.score_points  =         20; 
			this.is_boss       =      false;

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
					this.projectile.body.velocity.x = (velocityX * 40) * this.scale.x;
					this.projectile.body.velocity.y = -400;

					this.wait_timer = this.wait_duration;

				} else {
					this.wait_timer--;
				}

			}

		};

	},

	// CHARGERS - Charges at player
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
			this.move_speed_x  =        300; // move speed
			this.move_speed_y  =          0; // jump speed
			this.wait_timer    =          0; // wait timer
			this.wait_duration =         60; // how long to wait?
			this.hit_points    =          5;
			this.stun_timer    =          0;
			this.stun_duration =         30;
			this.score_points  =         20; 
			this.is_boss       =      false;

			// for setting physics properties
			this.initiated_physics =  false;

		};
		Charger.prototype = Object.create(Phaser.Sprite.prototype);
		Charger.prototype.constructor = Charger;
		Charger.prototype.update = function() {

			if (!this.initiated_physics) {

				this.body.collideWorldBounds = false;
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

				if(this.inCamera == false) {

					if((this.x - this.game.player.x > 480)
						|| (this.x - this.game.player.x < -480)
						|| (this.y - this.game.player.y > 320)
						|| (this.y - this.game.player.y < -320)) {

						this.kill();

					} else {

						// stop
						this.body.velocity.x = 0;

					}

				}

				if(this.body.velocity.x == 0) {

					if(this.game.player.x < this.x) {

						// move left
						this.body.velocity.x = -(this.move_speed_x);
						this.scale.x = -1;

					} else {

						// move right
						this.body.velocity.x = (this.move_speed_x);
						this.scale.x = 1;

					}

				}

			}

		};

	},

	// FLIERS - Fly at player and disappear off screen.
	defineFlier: function() {
	
		Flier = function(game, x, y, direction) {
				
			Phaser.Sprite.call(this, game, x, y, 'Flier');
			this.anchor.setTo(0.5, 0.5);
			this.scale.x =  direction;

			// attributes
			this.active        =      false; // becomes active when spotted
			this.move_timer    =          0; // move timer
			this.move_duration =          0; // how long to move?
			this.move_direction = direction; // which direction to move?
			this.move_speed_x  =        150; // move speed
			this.move_speed_y  =        300; // jump speed
			this.wait_timer    =          0; // wait timer
			this.wait_duration =         60; // how long to wait?
			this.hit_points    =          5;
			this.stun_timer    =          0;
			this.stun_duration =         30;
			this.score_points  =         20; 
			this.is_boss       =      false;

			// for setting physics properties
			this.initiated_physics =  false;

		};
		Flier.prototype = Object.create(Phaser.Sprite.prototype);
		Flier.prototype.constructor = Flier;
		Flier.prototype.update = function() {

			if (!this.initiated_physics) {

				this.body.collideWorldBounds = false;
				this.body.setSize(32, 32, 0, 0);
				this.body.allowGravity = false;
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

				// keeps going until off screen
				if(this.inCamera == false) {

					if((this.x - this.game.player.x > 480)
						|| (this.x - this.game.player.x < -480)
						|| (this.y - this.game.player.y > 320)
						|| (this.y - this.game.player.y < -320)) 
					{

						this.kill();
					
					}

				}

				if(this.y >= this.game.player.y || this.body.velocity.x == 0) {
					
					this.body.velocity.y = 0;

				}


				if(this.body.velocity.x == 0 
					&& ((this.x > this.game.player.x && this.x - this.game.player.x < 240)
						|| (this.x < this.game.player.x && this.x - this.game.player.x > -240)) 
					&& ((this.y > this.game.player.y && this.y - this.game.player.y < 160)
						|| (this.y < this.game.player.y && this.y - this.game.player.y > -160)))
				{

					if(this.game.player.x < this.x) {

						// move left
						this.body.velocity.x = -(this.move_speed_x);
						this.scale.x = -1;

					} else {

						// move right
						this.body.velocity.x = (this.move_speed_x);
						this.scale.x = 1;

					}

					this.body.velocity.y = this.move_speed_y;

				}

			}

		};

	},

	// BOSS - Beat to finish level
	defineBoss: function() {

		Boss = function(game, x, y, direction) {

			Phaser.Sprite.call(this, game, x, y, 'Boss');
			this.anchor.setTo(0.5, 1);
			this.scale.x =  direction;

			// attributes
			this.active        =      false; // becomes active when spotted
			this.move_timer    =          0; // move timer
			this.move_duration =         60; // how long to move?
			this.move_direction = direction; // which direction to move?
			this.move_speed_x  =        200; // move speed
			this.move_speed_y  =          0; // jump speed
			this.wait_timer    =        120; // wait timer
			this.wait_duration =        120; // how long to wait?
			this.hit_points    =         60;
			this.stun_timer    =          0;
			this.stun_duration =         30;
			this.score_points  =       1000; 
			this.is_boss       =       true;

			// boss attributes
			this.attack_type   =          2;

			// for setting physics properties
			this.initiated_physics =  false;

			// projectiles
			this.projectile = null;

		};

		Boss.prototype = Object.create(Phaser.Sprite.prototype);
		Boss.prototype.constructor = Boss;
		Boss.prototype.update = function() {

			// initiate physics
			if(!this.initiated_physics) {

				this.body.collideWorldBounds = true;
				this.body.setSize(82, 112, 0, 0);
				this.initiated_physics = true;

			}

			// activate
			if(this.inCamera && !this.active) {
			 	this.active = true;

			 	this.game.camera.unfollow();
			 	this.game.camera.focusOnXY(4560, 800);

			 	// set music
				if(BasicGame.music != null && BasicGame.music.key != 'BossMusic') {
					BasicGame.music.stop();
					BasicGame.music = null;
				}

				if(BasicGame.music == null) {
					BasicGame.music = this.game.add.audio('BossMusic', 0.8, true);
		    		BasicGame.music.loop = true;
		    		BasicGame.music.play();
				}

			}

			// move pattern
			if(this.active) {

				if(this.stun_timer == 0) {
					this.alpha = 1.0;
				} else {
					this.stun_timer--;
				}

				// if charging then stop
				if(this.attack_type == 1
					&& this.body.onWall() 
					&& this.move_timer != 0) {

					this.body.velocity.x = 0;
					this.wait_timer = this.wait_duration;
					this.move_timer = 0;

					// randomise next attack
					this.attack_type = this.game.rnd.integerInRange(1, 2);
				}

				// if flinging stop
				if(this.attack_type == 2 && this.move_timer != 0) {

					this.wait_timer = this.wait_duration;
					this.move_timer = 0;
					
					// randomise next attack
					this.attack_type = this.game.rnd.integerInRange(1,2);

				}

				if(this.wait_timer == 0 && this.move_timer == 0
					&& this.body.velocity.x == 0) {

					//console.log("attack");

					// attack 1 - charge at player until against a wall
					if(this.attack_type == 1) 
					{
						if(this.x > this.game.player.x) {

							this.body.velocity.x = -(this.move_speed_x);
							this.scale.x = -1;

						} else {

							this.body.velocity.x = (this.move_speed_x);
							this.scale.x = 1;

						}

						this.move_timer = 999;
					}
					// attack 2 - fling 3 projectiles
					else if(this.attack_type == 2)
					{

						if(this.x > this.game.player.x) {

							this.scale.x = -1;

						} else {

							this.scale.x = 1;

						}

						for(i = 1; i < 4; i++) {

							this.projectile = this.game.projectiles.create(this.x, this.y - 64, 'Projectile');
							this.projectile.anchor.setTo(0.5, 0.5);
							this.projectile.body.velocity.x = (i * 140) * this.scale.x;
							this.projectile.body.velocity.y = -400;

						}

						this.move_timer = 999;

					}

				} else {

					this.wait_timer --;

				}

			}

		};

	},
	
}