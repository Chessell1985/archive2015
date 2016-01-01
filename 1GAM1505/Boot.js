var BasicGame = {};

BasicGame.Boot = function(game) {

};

BasicGame.Boot.prototype = {
	init: function() {
		//console.log("Boot - init.");
	
		// not multi-touch
		this.game.input.maxPointers = 1;
		
		// disable game pause if browser tab has lost focus?
		this.game.stage.disableVisibilityChange = true;
		
		if(this.game.device.desktop) {
			// desktop settings here
			this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
		    this.game.stage.scale.minWidth = 480;
		    this.game.stage.scale.minHeight = 320;
		    this.game.stage.scale.maxWidth = 480;
		    this.game.stage.scale.maxHeight = 320;
		    this.game.stage.scale.forceLandscape = true;
		    this.game.stage.scale.pageAlignHorizontally = true;	
		    this.game.stage.scale.setScreenSize(true);
		} else {
			// mobile settings here
			this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
		    this.game.stage.scale.minWidth = 480;
		    this.game.stage.scale.minHeight = 320;
		    this.game.stage.scale.maxWidth = 480;
		    this.game.stage.scale.maxHeight = 320;
		    this.game.stage.scale.forceLandscape = true;
		    this.game.stage.scale.pageAlignHorizontally = true;
		    this.game.stage.scale.setScreenSize(true);
		}
	},
	
	preload: function() {
		//console.log("Boot - preload.");
		
		// load assets
		this.load.image('preloaderBackground', 'Assets/PreloaderBackground.png');
		this.load.image('preloaderBar', 'Assets/PreloaderBar.png');
		
	},
	
	create: function() {
		//console.log("Boot - create.");
		
		// start next state
		this.game.state.start('Preloader');
		
	}
};