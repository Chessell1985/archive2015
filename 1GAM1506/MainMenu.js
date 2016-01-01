BasicGame.MainMenu = function(game) {
	
	BasicGame.keys = null;
	
	var parallaxBackground;
	var parallaxClouds1;
	var parallaxClouds2;

};

BasicGame.MainMenu.prototype = {

	create: function() {
	
		BasicGame.keys = {
			ENTER: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),
			C: this.input.keyboard.addKey(Phaser.Keyboard.C),
			H: this.input.keyboard.addKey(Phaser.Keyboard.H),
			X: this.input.keyboard.addKey(Phaser.Keyboard.X),
		}
		
		BasicGame.keys.ENTER.onDown.add(function() {
			// reset all keys
			BasicGame.keys.ENTER.reset;
			BasicGame.keys.C.reset;
			BasicGame.keys.H.reset;
			BasicGame.keys.X.reset;
			// start game
			this.startGame();
		}, this);
		
		BasicGame.keys.C.onDown.add(function() {
			// reset all keys
			BasicGame.keys.ENTER.reset;
			BasicGame.keys.C.reset;
			BasicGame.keys.H.reset;
			BasicGame.keys.X.reset;
			// go to credits
			this.game.state.start('Credits');
		}, this);
		
		BasicGame.keys.H.onDown.add(function() {
			// reset all keys
			BasicGame.keys.ENTER.reset;
			BasicGame.keys.C.reset;
			BasicGame.keys.H.reset;
			BasicGame.keys.X.reset;
			// go to help
			this.game.state.start('Help');
		}, this);
		
		BasicGame.keys.X.onDown.add(function() {
			// turn off sound
			if(BasicGame.music.isPlaying) {
				BasicGame.music.stop();
				BasicGame.playMusic = false;
			} else {
				BasicGame.music.play();
				BasicGame.music.loop = true;
				BasicGame.playMusic = true;
			}
		}, this);
		
		this.parallaxBackground = this.add.tileSprite(0,0,960,640,'ParallaxBackground');
		this.parallaxClouds1    = this.add.tileSprite(0,640 - 256,960,239,'ParallaxClouds1');
		this.parallaxClouds2    = this.add.tileSprite(0,640 - 256 + 50,960,239,'ParallaxClouds1');	
		
		var text = this.add.text(480, 160, "HAPPY GLIDER", 
		{font:"bold 56px Courier New",align:"center", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 240, "How far can you go?", 
		{font:"bold 40px Courier New",align:"center", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 360, "Press [Enter] to Start!", 
		{font:"bold 40px Courier New",align:"center", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 440, "[H]: Help, [C]: Credits, [X]: Toggle Sound", 
		{font:"bold 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
	},
	
	update: function() {
		if ((!BasicGame.music || !BasicGame.music.isPlaying) && BasicGame.playMusic) {
			BasicGame.music      = this.add.audio('BackgroundMusic', 1, true);
			BasicGame.music.loop = true;
			BasicGame.music.play();
		}	
	},
	
	startGame: function() {
	
		this.game.state.start('Game');
		
	}
	
}