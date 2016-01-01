BasicGame.Game2 = function(game) {

};

BasicGame.Game2.prototype = {

	create: function() {

		// world settings
		this.world.setBounds(0, 0, 160, 144);
		this.stage.backgroundColor = '#FF9900';
		this.map = this.add.tilemap('Tilemap');
    	this.map.addTilesetImage('Tileset', 'Tileset');
    	this.backgroundLayer = this.map.createLayer('backgroundlayer');
    	this.blockLayer = this.map.createLayer('blocklayer');

		// assign keys
		this.resetKeys();

	},
	
	update: function() {

	},

	pad: function(n, w, z) {
		z = z || "0";
		n = n + "";
		return n.length >= w ? n : new Array(w - n.length + 1).join(z) + n;		
	},

	resetKeys: function() {

		BasicGame.cursor_keys.up.reset();
		BasicGame.letter_keys.a.reset();

	},
	
}