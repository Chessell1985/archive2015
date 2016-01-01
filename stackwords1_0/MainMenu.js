BasicGame.MainMenu = function(game) {
	
	this.background = null;
	
	//keys
	var key_ENTER;
	var proceed;

};

BasicGame.MainMenu.prototype = {

	create: function() {
	
		// keys
		key_ENTER = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		key_ENTER.onDown.add(function() {this.startGame();}, this);
		
		var _text;
		
		// title
		_text = this.add.text(240, 100, "STACK WORDS", {font:"28px arial",align:"right", fill:"#00ffff"});
		_text.anchor.x = Math.round(_text.width * 0.5) / _text.width;
		_text.anchor.y = Math.round(_text.height * 0.5) / _text.height;
		
		// instructions
		// line 1
		_text = this.add.text(240, 140, "Swap columns using A, S, D", 
		{font:"16px arial",align:"left", fill:"#ffffff"});
		_text.anchor.x = Math.round(_text.width * 0.5) / _text.width;
		_text.anchor.y = Math.round(_text.height * 0.5) / _text.height;
		// line 2
		_text = this.add.text(240, 160, "Drop falling blocks using DOWN.", 
		{font:"16px arial",align:"left", fill:"#ffffff"});
		_text.anchor.x = Math.round(_text.width * 0.5) / _text.width;
		_text.anchor.y = Math.round(_text.height * 0.5) / _text.height;
		// line 3
		_text = this.add.text(240, 190, "Match blocks by colour to clear them, or", 
		{font:"16px arial",align:"left", fill:"#ffffff"});
		_text.anchor.x = Math.round(_text.width * 0.5) / _text.width;
		_text.anchor.y = Math.round(_text.height * 0.5) / _text.height;
		// line 4
		_text = this.add.text(240, 210, "spell out any of the 3 chosen words.", 
		{font:"16px arial",align:"left", fill:"#ffffff"});
		_text.anchor.x = Math.round(_text.width * 0.5) / _text.width;
		_text.anchor.y = Math.round(_text.height * 0.5) / _text.height;
		
		_text = this.add.text(240, 250, "Press Enter to Start", {font:"20px arial",align:"right", fill:"#ffffff"});
		_text.anchor.x = Math.round(_text.width * 0.5) / _text.width;
		_text.anchor.y = Math.round(_text.height * 0.5) / _text.height;
	},
	
	update: function() {
		
	},
	
	startGame: function() {
		this.game.state.start('Game');
	}
	
}