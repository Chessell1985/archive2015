var BasicGame = {
	music: null,
	playMusic: true,
	keys: null,
};

BasicGame.Boot = function(game) {
	
};

BasicGame.Boot.prototype = {
	init: function() {
		
		// not multi-touch
		this.game.input.maxPointers = 1;
		
		// disable game pause if browser tab has lost focus?
		this.game.stage.disableVisibilityChange = true;
		
		if(this.game.device.desktop) {
			// desktop settings here
			this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
		    this.game.stage.scale.minWidth = 480;
		    this.game.stage.scale.minHeight = 320;
		    this.game.stage.scale.maxWidth = 960;
		    this.game.stage.scale.maxHeight = 640;
		    this.game.stage.scale.forceLandscape = true;
		    this.game.stage.scale.pageAlignHorizontally = true;	
		    this.game.stage.scale.setScreenSize(true);
		} else {
			// mobile settings here
			this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
		    this.game.stage.scale.minWidth = 480;
		    this.game.stage.scale.minHeight = 320;
		    this.game.stage.scale.maxWidth = 960;
		    this.game.stage.scale.maxHeight = 640;
		    this.game.stage.scale.forceLandscape = true;
		    this.game.stage.scale.pageAlignHorizontally = true;
		    this.game.stage.scale.setScreenSize(true);
		}
		
	},
	
	preload: function() {
		
		this.load.image('PreloaderBarEmpty', 'Assets/PreloaderBarEmpty.png');
		this.load.image('PreloaderBarFull', 'Assets/PreloaderBarFull.png');
		
	},
	
	create: function() {
		
		this.game.state.start('Preloader');
		
	}
};