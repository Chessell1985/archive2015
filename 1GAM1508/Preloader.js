BasicGame.Preloader = function(game) {
	
	this.background = null;
	this.preloadBar = null;
	
	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function() {

		this.stage.backgroundColor = "#FFFFFF";
		
		// add sprites
		//this.background = this.add.sprite(80, 128, 'PreloaderBarEmpty');
		
		//this.preloadBar = this.add.sprite(80, 128, 'PreloaderBarFull');
		
		// set loader sprite (handles cropping)
		//this.load.setPreloadSprite(this.preloadBar);


		// load tilemaps
		this.load.tilemap('Tilemap', 'assets/tileset_1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('Tileset', 'assets/tileset_1.png');

		this.load.image('GameLogo', 'assets/heliomancerslogo.png');
		this.load.image('Bullet', 'assets/bullet.png');
		this.load.image('ChargeUnit', 'assets/chargeunit.png');
		this.load.image('ChargeMeter', 'assets/chargemeter.png');
		this.load.image('HealthUnit', 'assets/healthunit.png');
		this.load.image('HealthMeter', 'assets/healthmeter.png');
		
		// load game assets
		this.load.spritesheet('NewGameButton', 'assets/newgamebutton.png', 64, 12, 2);
		this.load.spritesheet('CreditsButton', 'assets/creditsbutton.png', 64, 12, 2);
		this.load.spritesheet('Player', 'assets/player.png', 16, 24, 4);
		this.load.spritesheet('LightSource', 'assets/lightsource.png', 16, 24, 4);


		this.load.spritesheet('OrangeJumper', 'assets/orangejumper.png', 16, 16, 4);
		
	},
	
	create: function() {
		
		// disable crop while waiting for music to decode
		//this.preloadBar.cropEnabled = false;
		
	},
	
	update: function() {
		
		//if(this.cache.isSoundDecoded('MenuMusic') && this.ready == false) {
		//	this.ready = true;

			this.game.state.start('MainMenu');
		//}
		
	}
	
}