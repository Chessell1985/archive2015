BasicGame.Game = function(game) {

	this.background = null;
	var parallaxBackground;
	var parallaxClouds1;
	var parallaxClouds2;
	
	var plane;
	
	var cursors;
	
	BasicGame.keys = null;
	
	var moveSpeed;
	var cloudSpeed;
	
	var powerUps;
	var powerTimer;
	var secondsTimer;
	var haltMovement;
	
	var hazards;
	
	var hazardPatterns;
	
	var score;
	var scoreText;
	
	var explosion;
	var speedup;

};

BasicGame.Game.prototype = {

	create: function() {
		
		this.parallaxBackground = this.add.tileSprite(0,0,960,640,'ParallaxBackground');
		this.parallaxClouds1    = this.add.tileSprite(0,640 - 256,960,239,'ParallaxClouds1');
		this.parallaxClouds2    = this.add.tileSprite(0,640 - 256 + 50,960,239,'ParallaxClouds1');	
		
		this.plane = this.add.sprite(64,320,'Plane');
		//this.plane.anchor.x = 0.5;
		//this.plane.anchor.y = 0.5;
		
		this.cursors = this.input.keyboard.createCursorKeys();
		
		BasicGame.keys = {
			ENTER: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),
			Q: this.input.keyboard.addKey(Phaser.Keyboard.Q),
		};
		
		this.powerUps = this.add.group();
		this.hazards  = this.add.group();
		
		BasicGame.keys.ENTER.onDown.add(function() {
			if(this.haltMovement == true) {
				BasicGame.keys.ENTER.reset;
				BasicGame.keys.Q.reset;
				this.game.state.start('Game');
			}
		}, this);
		
		BasicGame.keys.Q.onDown.add(function() {
			if(this.haltMovement == true) {
				BasicGame.keys.ENTER.reset;
				BasicGame.keys.Q.reset;
				this.game.state.start('MainMenu');
			}
		}, this);
		
		this.moveSpeed  = 5;
		this.cloudSpeed = 5;
		
		this.powerTimer = 0;
		
		this.haltMovement = false;
		
		this.score     = 0;
		
		this.scoreText = this.add.text(940, 20, "SCORE: " + this.pad(this.score,7,"0"), 
		{font:"bold 40px Courier New",align:"right", fill:"#ffffff", stroke:"#000099", strokeThickness:6});
		
		this.scoreText.anchor.x = 1;
		
		// hazard patterns - hazards appear in a pre-defined shape.
		// the numbers represent y, x is determined by array index
		this.hazardPatterns = [
			// diagonal down
			[[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]],
			// diagonal up
			[[0,9],[1,8],[2,7],[3,6],[4,5],[5,4],[6,3],[7,2]],
			// diamond
			[[0,4],[1,5],[1,3],[2,2],[2,6],[3,3],[3,5],[4,4]],
			// converge
			[[0,0],[1,1],[2,2],[3,3],[0,9],[1,8],[2,7],[3,6]],
			// wide pipe
			[[0,9],[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],
				[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6]],
			// two diamonds
			[[0,2],[1,1],[1,3],[2,0],[2,4],[3,1],[3,3],[4,2],
				[5,7],[6,6],[6,8],[7,5],[7,9],[8,6],[8,8],[9,7]],
			// thin pipe
			[[0,9],[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],
				[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]],
			// three diamonds
			[[0,2],[1,1],[1,3],[2,0],[2,4],[3,1],[3,3],[4,2],
				[5,7],[6,6],[6,8],[7,5],[7,9],[8,6],[8,8],[9,7],
					[10,2],[11,1],[11,3],[12,0],[12,4],[13,1],[13,3],[14,2]],
			// super tough pipe!
			[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
				[4,9],[4,8],[4,7],[4,6],[4,5],[4,4],[4,3],
					[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]],
			// four tight diamonds!
			[[0,7],[1,6],[1,8],[2,5],[2,9],[3,6],[3,8],[4,7],
				[3,2],[4,1],[4,3],[5,0],[5,4],[6,1],[6,3],[7,2],
					[6,7],[7,6],[7,8],[8,5],[8,9],[9,6],[9,8],[10,7],
						[9,2],[10,1],[10,3],[11,0],[11,4],[12,1],[12,3],[13,2]],
			// minefield!
			[[0,0],[6,0],
				[3,1],[9,1],
					[0,2],[6,2],
						[3,3],[9,3],
							[0,4],[6,4],
								[3,5],[9,5],
									[0,6],[6,6],
										[3,7],[9,7],
											[0,8],[6,8],
												[3,9],[9,9]],
			// you're done for!
			[
			[17,0],
			[17,1],
			[17,2],[3,2],[4,2],[5,2], [7,2],                   [11,2], [13,2],[14,2],
			[17,3],[3,3],             [7,3],[8,3],             [11,3], [13,3],       [15,3],
			[17,4],[3,4],[4,4],[5,4], [7,4],      [9,4],       [11,4], [13,4],       [15,4],
			[17,5],[3,5],             [7,5],            [10,5],[11,5], [13,5],       [15,5],
			[17,6],[3,6],[4,6],[5,6], [7,6],                   [11,6], [13,6],[14,6],
			[17,7],
			[17,8],
			[17,9]
			],
		];
		
		this.explosion = this.add.audio('Explosion');
		this.speedup = this.add.audio('Speedup');
		
	},
	
	update: function() {
		if ((!BasicGame.music || !BasicGame.music.isPlaying) && BasicGame.playMusic) {
			BasicGame.music      = this.add.audio('BackgroundMusic', 1, true);
			BasicGame.music.loop = true;
			BasicGame.music.play();
		}	
	
		if(this.haltMovement == false) {
			var moveX = this.cloudSpeed;
			var moveY = this.cloudSpeed;
		
			if(this.cursors.right.isDown && !(this.cursors.left.isDown)) {
				while(this.plane.x + this.plane.width + moveX > 960 && moveX != 0) {
					moveX--;
				}
				this.plane.x += moveX;
			}
			if(this.cursors.left.isDown && !(this.cursors.right.isDown)) {
				while(this.plane.x - moveX < 0 && moveX != 0) {
					moveX--;
				}
				this.plane.x -= moveX;
			}
			if(this.cursors.down.isDown && !(this.cursors.up.isDown)) {
				while(this.plane.y + this.plane.height + moveY > 640 && moveY != 0) {
					moveY--;
				}
				this.plane.y += moveY;
			}
			if(this.cursors.up.isDown && !(this.cursors.down.isDown)) {
				while(this.plane.y - moveY < 0 && moveY != 0) {
					moveY--;
				}
				this.plane.y -= moveY;
			}
		}
		
		if(this.haltMovement == true) {
			if(this.plane.y - (this.plane.height / 2) < 640) {
				this.plane.x += 1;
				this.plane.y += 4;
			}
		}
		
		if(this.powerTimer == 0) {
			if(this.cloudSpeed > 5) {
				this.cloudSpeed = 5;
			}
		} else {
			this.powerTimer--;
		}	
		
		this.parallaxBackground.tilePosition.x -= this.cloudSpeed - 4;
		this.parallaxClouds1.tilePosition.x    -= this.cloudSpeed - 2;
		this.parallaxClouds2.tilePosition.x    -= this.cloudSpeed;

		//console.log(this.powerUps.length);
		
		for(i = 0; i < this.powerUps.length; i++) {
			this.powerUps.getAt(i).x -= (this.cloudSpeed);
			//this.powerUps.getAt(i).y -= this.cloudSpeed;
			if(this.collisionWithObject(this.powerUps.getAt(i))) {
				this.powerUps.getAt(i).destroy();
				i--;
				this.cloudSpeed = 15;
				this.powerTimer = 60 * 3;
				if(BasicGame.playMusic) this.speedup.play();
			} else if (this.powerUps.getAt(i).x + this.powerUps.getAt(i).width < 0) {
				this.powerUps.getAt(i).destroy();
				i--;
			}
		}
		
		for(i = 0; i < this.hazards.length; i++) {
			this.hazards.getAt(i).x -= this.cloudSpeed;
			if(this.collisionWithObject(this.hazards.getAt(i)) && this.haltMovement == false) {
				this.haltMovement = true;
				this.gameOver();
			} else if (this.hazards.getAt(i).x + this.hazards.getAt(i).width < 0) {
				this.hazards.getAt(i).destroy();
				i--;
			}
		}
		
		if(this.haltMovement == false) {
			this.score += (this.cloudSpeed / 5);
			this.scoreText.setText("SCORE: " + this.pad(this.score,7,"0"));
			
			this.createPowerUp();
			this.createHazardPattern();
		}
		
	},
	
	gameOver: function() {
	
		this.scoreText.destroy();
		
		if(BasicGame.playMusic) this.explosion.play();
		
		// switch sprite to on fire
		var x = this.plane.x;
		var y = this.plane.y;
		this.plane.destroy();
		this.plane = this.add.sprite(x,y,'PlaneFire');
		
		var text = this.add.text(480, 160, "GAME OVER", 
		{font:"bold 48px Courier New",align:"right", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 240, "YOUR SCORE: " + this.score, 
		{font:"bold 40px Courier New",align:"right", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 400, "[Enter]: Restart, [Q]: Quit", 
		{font:"bold 32px Courier New",align:"right", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
	},
	
	createPowerUp: function() {
		
		if(this.score % 1000 != 0) return;
		
		var random = this.rnd.integerInRange(100,380);
		
		var sprite = this.add.sprite(1000, random, 'PowerUp');
		this.powerUps.add(sprite);
	},
	
	createHazard: function() {
		var sprite = this.add.sprite(896, 320, 'Hazard');
		this.hazards.add(sprite);
	},
	
	createHazardPattern: function() {
		if(this.hazards.length > 0) return;
		
		var rndMax = this.score / 750;
		if(rndMax < 2) rndMax = 2;
		if(rndMax > this.hazardPatterns.length) rndMax = this.hazardPatterns.length;
		var rndMin = rndMax - 3;
		if(rndMin < 0) rndMin = 0;
		if(rndMax == this.hazardPatterns.length) rndMin = rndMax - 1;
		
		var rnd = this.rnd.integerInRange(rndMin, rndMax);
		var pattern = this.hazardPatterns[rnd];
		
		for(i = 0; i < this.hazardPatterns[rnd].length; i++) {
			var sprite = this.add.sprite(960 + (pattern[i][0] * 64), pattern[i][1] * 64, 'Hazard');
			this.hazards.add(sprite);
		}
	},
	
	pad: function(n, w, z) {
		z = z || "0";
		n = n + "";
		return n.length >= w ? n : new Array(w - n.length + 1).join(z) + n;		
	},
	
	collisionWithObject: function(p) {
		x1 = this.plane.x + 8;
		y1 = this.plane.y + 20; // account for sprite
		w1 = 48 //this.plane.width; // account for sprite
		h1 = 28 //this.plane.height; // account for sprite
		
		x2 = p.x;
		y2 = p.y;
		w2 = p.width;
		h2 = p.height;
		
		// rectangular collision code!
		if(x1 < (x2 + w2) && (x1 + w1) > x2 && y1 < (y2 + h2) && (y1 + h1) > y2) {
		   	return true;
		}
		
		return false;
	}
	
}