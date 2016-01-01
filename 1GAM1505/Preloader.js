BasicGame.Preloader = function(game) {
	
	this.background = null;
	this.preloadBar = null;
	
	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function() {
		
		// add sprites
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(60, 140, 'preloaderBar');
		
		// set loader sprite (handles cropping)
		this.load.setPreloadSprite(this.preloadBar);
		
		// load game assets
		this.load.audio('titleMusic', ['Assets/TestBGM.mp3']);
		this.load.atlasJSONHash('Textures','Textures.png','Textures.json');
		
	},
	
	create: function() {
		
		// disable crop while waiting for music to decode
		this.preloadBar.cropEnabled = false;
		
	},
	
	update: function() {
		
		if(this.cache.isSoundDecoded('titleMusic') && this.ready == false) {
			this.ready = true;
			this.game.state.start('MainMenu');
		}
		
	}
	
}