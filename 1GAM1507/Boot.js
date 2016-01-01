var BasicGame = {

	// transition
	transition_manager: null,
	
	// key inputs
	cursor_keys: null,
	letter_keys: null,

	// player data
	high_score: 0,

	// music
	mute: false,
	music: null,

};

BasicGame.Boot = function(game) {	
};

BasicGame.Boot.prototype = {
	init: function() {

		// not multi-touch
		this.input.maxPointers = 1;
		
		
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 480;
		this.scale.minHeight = 320;
		this.scale.maxWidth = 480;
		this.scale.maxHeight = 320;
		this.scale.pageAlignHorizontally = true;	
		this.scale.pageAlignVertically = true;	
		this.scale.setScreenSize(true);
		
	},
	
	preload: function() {
		
		this.load.image('PreloaderBarEmpty', 'Assets/PreloaderBarEmpty.png');
		this.load.image('PreloaderBarFull', 'Assets/PreloaderBarFull.png');
		
	},
	
	create: function() {
		
		this.game.state.start('Preloader');
		
	}
};