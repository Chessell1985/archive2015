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
		this.background = this.add.sprite(80, 128, 'PreloaderBarEmpty');
		
		this.preloadBar = this.add.sprite(80, 128, 'PreloaderBarFull');
		
		// set loader sprite (handles cropping)
		this.load.setPreloadSprite(this.preloadBar);
		
		// load game assets
		this.load.tilemap('Tilemap', 'Assets/Tileset.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('Tileset', "Assets/Tileset.png");

		// images
		this.load.image('GameTitle', 'Assets/GameTitle.png');
		this.load.image('Block', 'Assets/TestBlock.png');
		this.load.image('Panel', 'Assets/TestPanel.png');
		this.load.image('Item', 'Assets/TestItem.png');
		this.load.image('Door', 'Assets/TestDoor.png');
		this.load.image('SmallEnemy', 'Assets/TestSmallEnemy.png');
		this.load.image('Menu', 'Assets/TestMenu.png');
		this.load.image('Light', 'Assets/TestLight.png');
		this.load.image('End', 'Assets/TestEnd.png');
		this.load.spritesheet('SmallExplosion', 'Assets/SmallExplosion.png', 32, 32, 5);

		// real assets
		this.load.image('CreditsBackground', 'Assets/credits_480x320.png');
		this.load.image('StartGameButton', 'Assets/StartGameButton.png');
		this.load.image('HelpButton', 'Assets/HelpButton.png');
		this.load.image('CreditsButton', 'Assets/CreditsButton.png');
		this.load.image('BackButton', 'Assets/BackButton.png');
		this.load.image('Shifter', 'Assets/Shifter.png');
		this.load.image('LifePack', 'Assets/LifePack.png');
		this.load.image('Jumper', 'Assets/Jumper.png');
		this.load.image('Flinger', 'Assets/Charger.png');
		this.load.image('Charger', 'Assets/Charger2.png');
		this.load.image('Flier', 'Assets/TestBat.png');
		this.load.image('Boss', 'Assets/Boss.png');
		this.load.image('Projectile', 'Assets/Projectile.png');
		this.load.image('Bullet', 'Assets/Bullet.png');
		this.load.spritesheet('Player', 'Assets/Player.png', 32, 32, 4);
		this.load.audio('MenuMusic', ['Assets/634246_Perfect-Pixels.mp3']);
		this.load.audio('LevelMusic', ['Assets/581200_A-Battle-In-The-Wil.mp3']);
		this.load.audio('BossMusic', ['Assets/541301_Cyber-Boss-Battle.mp3']);
		this.load.audio('Shoot', ['Assets/Shoot.wav']);
		this.load.audio('Hit', ['Assets/Hit.wav']);
		this.load.audio('Collect', ['Assets/Collect.wav']);
		this.load.audio('Jump', ['Assets/Jump.wav']);
		this.load.audio('Explode1', ['Assets/Explode1.wav']);
		this.load.audio('Explode2', ['Assets/Explode2.wav']);
		this.load.audio('Explode3', ['Assets/Explode3.wav']);
		
	},
	
	create: function() {
		
		// disable crop while waiting for music to decode
		this.preloadBar.cropEnabled = false;
		
	},
	
	update: function() {
		
		if(this.cache.isSoundDecoded('MenuMusic') && this.ready == false) {
			this.ready = true;

			BasicGame.transition_manager.to('MainMenu');
			//this.game.state.start('MainMenu');
		}
		
	}
	
}