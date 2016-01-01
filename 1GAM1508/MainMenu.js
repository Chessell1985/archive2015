BasicGame.MainMenu = function(game) {

	var title;
	var level;

	var score_text;

	var keys;

	// state-specific
	var selected_option;

	var image;

	var new_game_button;
	var credits_button;

};

BasicGame.MainMenu.prototype = {

	create: function() {

		// world settings
		this.stage.backgroundColor = '#000033';

		// initialise keys
		BasicGame.cursor_keys = this.input.keyboard.createCursorKeys();
		BasicGame.letter_keys = {
			a: this.input.keyboard.addKey(Phaser.Keyboard.A), // GB A Button
			s: this.input.keyboard.addKey(Phaser.Keyboard.S), // GB B Button
			z: this.input.keyboard.addKey(Phaser.Keyboard.Z), // GB Start Button
			x: this.input.keyboard.addKey(Phaser.Keyboard.X), // GB Select Button
		};

		// selected button
		this.selected_option = 0;

		// add images
		this.image = this.add.sprite(80, 48, 'GameLogo');
		this.image.anchor.setTo(0.5, 0.5);

		// add buttons
		this.new_game_button = this.add.sprite(80, 100, 'NewGameButton');
		this.new_game_button.anchor.setTo(0.5, 0.5);
		this.new_game_button.animations.add('Selected');
		this.new_game_button.animations.play('Selected', 10, true, false);

		this.credits_button = this.add.sprite(80, 118, 'CreditsButton');
		this.credits_button.anchor.setTo(0.5, 0.5);
		this.credits_button.animations.add('Selected');


		BasicGame.cursor_keys.up.onDown.add(function () {

			this.selectOption(0);

		}, this);

		BasicGame.cursor_keys.down.onDown.add(function () {

			this.selectOption(1);

		}, this);

		BasicGame.letter_keys.a.onDown.add(function() {

			this.confirmOption();

		}, this);

	},
	
	update: function() {
	},

	selectOption: function(direction) {

		if(this.selected_option === 0) {

			this.selected_option = 1;
			this.credits_button.animations.play('Selected', 10, true, false);
			this.new_game_button.frame = 0;
			this.new_game_button.animations.stop(null, false);

		} else {

			this.selected_option = 0;
			this.new_game_button.animations.play('Selected', 10, true, false);
			this.credits_button.frame = 0;
			this.credits_button.animations.stop(null, false);

		}

	},

	confirmOption: function() {

		if(this.selected_option === 0) {

			this.goToGame();

		}

	},
	
	goToGame: function() {
		this.game.state.start('Game');
	},

	goToCredits: function() {
	},
	
	render: function() {

		//  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
    	BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, 
    		this.game.width, this.game.height, 0, 0, BasicGame.pixel.width, BasicGame.pixel.height);

	},
	
}