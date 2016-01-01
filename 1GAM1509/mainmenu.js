BasicGame.MainMenu = function(game) {

};

BasicGame.MainMenu.prototype = {

	create: function() {

		// world settings
		this.stage.backgroundColor = '#000000';

		// initialise keys
		BasicGame.cursor_keys = this.input.keyboard.createCursorKeys();
		BasicGame.other_keys = {

			enter: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),

		};
		BasicGame.other_keys.enter.onDown.add(this.startGame, this);

		this.text = this.game.add.text(320, 80, "(WIP) Strategy Game", 
			{font:"bold 32px Arial",align:"centre", fill:"#ffffff", stroke:"#000000", strokeThickness:0});
		this.text.anchor.setTo(0.5, 0.5);

		this.text = this.game.add.text(320, 240, "Press [Enter] To Start", 
			{font:"bold 28px Arial",align:"centre", fill:"#ffffff", stroke:"#000000", strokeThickness:0});
		this.text.anchor.setTo(0.5, 0.5);

		this.text = this.game.add.text(320, 400, "Liam Chessell (liamchessell.com)", 
			{font:"normal 16px Arial",align:"centre", fill:"#ffffff", stroke:"#000000", strokeThickness:0});
		this.text.anchor.setTo(0.5, 0.5);

	},
	
	update: function() {

	},

	startGame: function() {

		this.game.state.start("Game");

	},
	
}