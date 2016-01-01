BasicGame.Preloader = function(game) {
	
	this.background = null;
	this.preloadBar = null;
	
	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function() {
		
		// add sprites
		this.background = this.add.sprite(480 - 400, 320 - 32, 'PreloaderBarEmpty');
		
		this.preloadBar = this.add.sprite(480 - 400, 320 - 32, 'PreloaderBarFull');
		
		// set loader sprite (handles cropping)
		this.load.setPreloadSprite(this.preloadBar);
		
		// load game assets
		this.load.audio('BackgroundMusic', ['Assets/Dating-on-a-Plane.mp3']);
		this.load.audio('Explosion','Assets/Explosion.wav');
		this.load.audio('Speedup','Assets/Speedup.wav');
		//this.load.atlasJSONHash('Textures','Textures.png','Textures.json');
		this.load.image('ParallaxClouds1', 'Assets/ParallaxClouds1.png');
		this.load.image('ParallaxBackground', 'Assets/ParallaxBackground.png');
		this.load.image('Plane', 'Assets/Plane.png');
		this.load.image('PowerUp', 'Assets/PowerUp.png');
		this.load.image('Hazard', 'Assets/Hazard.png');
		this.load.image('PlaneFire', 'Assets/PlaneFire.png');
		
	},
	
	create: function() {
		
		// disable crop while waiting for music to decode
		this.preloadBar.cropEnabled = false;
		
	},
	
	update: function() {
		
		if(this.cache.isSoundDecoded('BackgroundMusic') && this.ready == false) {
			this.ready = true;
			this.game.state.start('MainMenu');
		}
		
	}
	
}