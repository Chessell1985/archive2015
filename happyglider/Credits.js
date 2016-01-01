BasicGame.Credits = function(game) {
	
	BasicGame.keys = null;
	
	var parallaxBackground;
	var parallaxClouds1;
	var parallaxClouds2;

};

BasicGame.Credits.prototype = {

	create: function() {
	
		BasicGame.keys = {
			ENTER: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),
		}
		
		BasicGame.keys.ENTER.onDown.add(function() {
			// reset all keys
			BasicGame.keys.ENTER.reset;
			// start game
			this.game.state.start('MainMenu');
		}, this);
		
		this.parallaxBackground = this.add.tileSprite(0,0,960,640,'ParallaxBackground');
		this.parallaxClouds1    = this.add.tileSprite(0,640 - 256,960,239,'ParallaxClouds1');
		this.parallaxClouds2    = this.add.tileSprite(0,640 - 256 + 50,960,239,'ParallaxClouds1');	
		
		var text = this.add.text(480, 160, "CREDITS", 
		{font:"bold 48px Courier New",align:"center", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 220, "Developed by Liam Chessell (liamchessell.com)", 
		{font:"bold 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 270, "For #1GAM (www.onegameamonth.com)", 
		{font:"bold 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 320, "'Dating on a Plane' BGM from newgrounds.com", 
		{font:"bold 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 370, "SFX created at bfxr.net", 
		{font:"bold 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000066", strokeThickness:6});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		
		var text = this.add.text(480, 460, "Press [Enter] to go back!", 
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
	}
	
}