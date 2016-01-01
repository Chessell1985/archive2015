BasicGame.Preloader = function(game) {
	
	this.background = null;
	this.preloadBar = null;
	
	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function() {

		// transitions
		BasicGame.transition_manager = this.game.plugins.add(Phaser.Plugin.StateTransition);

		//define new properties to be tweened, duration, even ease
		BasicGame.transition_manager.settings({

		    //how long the animation should take
		    duration: 1000,

		    //ease property
		    ease: Phaser.Easing.Exponential.InOut, /* default ease */

		    //what property should be tweened
		    properties: {
		        alpha: 0,
		        scale: {
		            x: 1.0,
		            y: 1.0
		        }
		    }
		});
		
		// add sprites
		this.background = this.add.sprite(160, 208, 'PreloaderBarEmpty');
		
		this.preloadBar = this.add.sprite(160, 208, 'PreloaderBarFull');
		
		// set loader sprite (handles cropping)
		this.load.setPreloadSprite(this.preloadBar);
		
		// load game assets
		this.load.tilemap('Tilemap', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('Tileset', "assets/tileset.png");

		// player icons	
		this.load.spritesheet('PlayerIcon', "assets/playericons.png", 64, 64, 2);

		// images
		this.load.image('SelectedSpace', 'assets/selectedspace.png');
		this.load.image('MoveSpace', 'assets/movespace.png');
		this.load.image('AttackSpace', 'assets/attackspace.png');
		this.load.image('EndTurn', 'assets/finishturn.png');
		this.load.spritesheet('HudBackground', 'assets/hudoptions.png', 640, 96, 2);
		this.load.spritesheet('Player1_Tank', 'assets/player1_tank.png', 32, 32, 4);
		this.load.spritesheet('Player2_Tank', 'assets/player2_tank.png', 32, 32, 4);
		this.load.spritesheet('Player1_Infantry', 'assets/player1_infantry.png', 32, 32, 4);
		this.load.spritesheet('Player2_Infantry', 'assets/player2_infantry.png', 32, 32, 4);
		this.load.spritesheet('Explosion', 'assets/explosion.png', 32, 32, 8);
		this.load.audio('SE_Explode', ['assets/explosion.wav']);
		this.load.audio('SE_Select', ['assets/select.wav']);
		this.load.audio('SE_Move', ['assets/move.wav']);
		
	},
	
	create: function() {
		
		// disable crop while waiting for music to decode
		this.preloadBar.cropEnabled = false;
		
	},
	
	update: function() {
		
		if(//this.cache.isSoundDecoded('MenuMusic') && 
			this.ready == false) {
			this.ready = true;

			//BasicGame.transition_manager.to("MainMenu");
			this.game.state.start("MainMenu");
		}
		
	}
	
}