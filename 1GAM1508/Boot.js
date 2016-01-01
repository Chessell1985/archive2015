var BasicGame = {

	// key inputs
	cursor_keys: null,
	letter_keys: null,

	// player data
	high_score: 0,

	// music
	mute: false,
	music: null,

	// scaling
	pixel: { scale: 3, canvas: null, context: null, width: 0, height: 0 },

};

BasicGame.Boot = function(game) {	
};

BasicGame.Boot.prototype = {
	init: function() {

		//  Hide the un-scaled game canvas
	    this.game.canvas.style['display'] = 'none';
	 
	    //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
	    BasicGame.pixel.canvas = Phaser.Canvas.create(this.game.width * BasicGame.pixel.scale, 
	    	this.game.height * BasicGame.pixel.scale);
	 
	    //  Store a reference to the Canvas Context
	    BasicGame.pixel.context = BasicGame.pixel.canvas.getContext('2d');
	 
	    //  Add the scaled canvas to the DOM
	    Phaser.Canvas.addToDOM(BasicGame.pixel.canvas);
	 
	    //  Disable smoothing on the scaled canvas
	    Phaser.Canvas.setSmoothingEnabled(BasicGame.pixel.context, false);
	 
	    //  Cache the width/height to avoid looking it up every render
	    BasicGame.pixel.width = BasicGame.pixel.canvas.width;
	    BasicGame.pixel.height = BasicGame.pixel.canvas.height;
		
	},
	
	preload: function() {
		
		//this.load.image('PreloaderBarEmpty', 'Assets/PreloaderBarEmpty.png');
		//this.load.image('PreloaderBarFull', 'Assets/PreloaderBarFull.png');
		
	},
	
	create: function() {
		
		this.game.state.start('Preloader');
		
	},

	render: function() {

		//  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
    	BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, 
    		this.game.width, this.game.height, 0, 0, BasicGame.pixel.width, BasicGame.pixel.height);

	},
};