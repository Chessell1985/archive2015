BasicGame.MainMenu = function(game) {

	var title;
	var level;

	var score_text;

	var keys;

};

BasicGame.MainMenu.prototype = {

	create: function() {

		// music
		if(BasicGame.music != null && BasicGame.music.key != 'MenuMusic') {
			BasicGame.music.stop();
			BasicGame.music = null;
		}

		if(BasicGame.music == null) {
			BasicGame.music = this.add.audio('MenuMusic', 1, true);
    		BasicGame.music.loop = true;
    		BasicGame.music.play();
		}

		// world settings
		this.stage.backgroundColor = '#000000';

		// initialise keys
		BasicGame.cursor_keys = this.input.keyboard.createCursorKeys();
		BasicGame.letter_keys = {
			a: this.input.keyboard.addKey(Phaser.Keyboard.A), // Action/Accept
			s: this.input.keyboard.addKey(Phaser.Keyboard.S), // Shoot
			d: this.input.keyboard.addKey(Phaser.Keyboard.D), // Dash
			m: this.input.keyboard.addKey(Phaser.Keyboard.M), // Mute/Unmute
		};

		// title
		this.title = this.add.sprite(240, 50, 'GameTitle');
		this.title.anchor.setTo(0.5, 0.5);

		// highscore?
		if(localStorage.getItem('HighScore') > 0) {
			this.score_text = 
			this.add.text(240, 125, "HIGH SCORE: " + this.pad(localStorage.getItem('HighScore'), 7, "0"), 
			{font:"normal 16px Courier New",align:"center", fill:"#ffff99", stroke:"#000000", strokeThickness:6});
			this.score_text.anchor.setTo(0.5, 0.5);
		}

		// option buttons
		this.level = this.add.button(240, 200, 'StartGameButton', this.startGame, this);
		this.level.anchor.setTo(0.5, 0.5);

		this.level = this.add.button(240, 245, 'HelpButton', this.seeHelp, this);
		this.level.anchor.setTo(0.5, 0.5);

		this.level = this.add.button(240, 290, 'CreditsButton', this.seeCredits, this);
		this.level.anchor.setTo(0.5, 0.5);

	},
	
	update: function() {

	},
	
	pad: function(n, w, z) {
		z = z || "0";
		n = n + "";
		return n.length >= w ? n : new Array(w - n.length + 1).join(z) + n;		
	},

	startGame: function() {

		BasicGame.transition_manager.to('Game2');
		//this.game.state.start('Game');

	},

	seeHelp: function() {
		BasicGame.transition_manager.to('Help');
	},

	seeCredits: function() {
		BasicGame.transition_manager.to('Credits');
		//this.game.state.start('MainMenu');
	},
	
}