var BasicGame = {

	// transition
	transition_manager: null,
	
	// key inputs
	cursor_keys: null,
	other_keys: null,

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
		this.scale.minWidth = 640;
		this.scale.minHeight = 480;
		this.scale.maxWidth = 640;
		this.scale.maxHeight = 480;
		this.scale.pageAlignHorizontally = true;	
		this.scale.pageAlignVertically = true;	
		this.scale.setScreenSize(true);
		
	},
	
	preload: function() {
		
		this.load.image('PreloaderBarEmpty', 'assets/preloaderbarempty.png');
		this.load.image('PreloaderBarFull', 'assets/preloaderbarfull.png');
		
	},
	
	create: function() {
		
		this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
		this.game.state.start('Preloader');
		
	}
};