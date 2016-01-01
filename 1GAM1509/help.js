BasicGame.Help = function(game) {

	var menu_button;

	var text;

};

BasicGame.Help.prototype = {

	create: function() {

		// world settings
		this.stage.backgroundColor = '#000000';
	
		this.text = 
			this.add.text(240, 50, "HELP", 
			{font:"bold 24px Courier New",align:"center", fill:"#ffffff", stroke:"#000000", strokeThickness:6});
		this.text.anchor.setTo(0.5, 0.5);

		this.menu_button = this.add.button(240, 290, 'BackButton', this.backToMenu, this, 2, 1, 0);
		this.menu_button.anchor.setTo(0.5, 0.5);

	},
	
	update: function() {

	},

	backToMenu: function() {
		BasicGame.transition_manager.to('MainMenu');
	},
	
}