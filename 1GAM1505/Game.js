BasicGame.Game = function(game) {
	
	this.background = null;
	
	// groups (array)
	var newBlocks;
	var fallBlocks;
	var oldBlocks;
	var matchBlocks;
	
	// block arrays
	var coloursToPick;
	var lettersToPick;
	var bagOfColours;
	var bagOfLetters;
	var words;
	var wordScores;
	
	// text
	var stackWords;
	
	// timer
	var count;
	var fallRate;
	
	// board stuff
	var boardX;
	var boardY;
	var boardHeight;
	var blockHeight;
	var boardStopLineY;
	var boardStartLineY;
	var gameScore;
	var gameScoreText;
	
	//misc
	var gameOver;
	var gameOverTimer;
	var callMatch;
	var animating;
	
	// keyboard
	var key_A;
	var key_S;
	var key_D;

};

BasicGame.Game.prototype = {

	create: function() {
	
		this.background = this.add.sprite(0, 0, 'Textures', 'GameBackground.png');
		
		// game board
		boardX   = 10;
		boardOffsetX = 16;
		boardY   = 10;
		boardStartLineY = 40;
		boardStopLineY = 270;
	
		// setting blocks
		blockHeight   = 30;
		blockWidth    = 56;
		blockOffsetX  = 5;
	
		// create block groups
		newBlocks  = [];
		fallBlocks = [];
		oldBlocks  = [];
		matchBlocks = [];
		
		// set block arrays
		coloursToPick = [0, 1, 2, 3, 4, 5];
		words         = ['FUN','GAME','FRIEND'];
		wordScores    = [0, 0, 0];
		wordScoresText = [];
		lettersToPick = [];
		
		for(i = 0; i < words.length; i++) {
			// add word to screen
			var _text = this.add.text(470, 120 + (i * 30), words[i] + " x " + this.pad(wordScores[i],2,"0"), {font:"24px arial",align:"right", fill:"#ffffff"});
			_text.anchor.x = 1;
			wordScoresText.push(_text);
		
			for(j = 0; j < words[i].length; j++) {
				var present = false;
				var letter  = words[i].substring(j,j+1);
				
				for(k = 0; k < lettersToPick.length; k++) {
					if(lettersToPick[k] == letter) {
						present = true;
					}
				}
				
				if(present == false) lettersToPick.push(words[i].substring(j,j+1));
			}
		}
		
		gameScore = 0;
		gameScoreText = this.add.text(470, 10, "SCORE: " + this.pad(gameScore,7,"0"), {font:"24px arial",align:"right", fill:"#ffffff"});
		gameScoreText.anchor.x = 1;
		
		bagOfColours = [];
		bagOfLetters = [];
		
		// keyboard
		key_A = this.input.keyboard.addKey(Phaser.Keyboard.A);
		key_A.onDown.add(function() {
			if(animating == false && gameOver == false) this.swapColumns(0, 1);
		}, this);
		key_S = this.input.keyboard.addKey(Phaser.Keyboard.S);
		key_S.onDown.add(function() {
			if(animating == false && gameOver == false) this.swapColumns(1, 2);
		}, this);
		key_D = this.input.keyboard.addKey(Phaser.Keyboard.D);
		key_D.onDown.add(function() {
			if(animating == false && gameOver == false) this.swapColumns(2, 3);
		}, this);
		key_DOWN = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		key_DOWN.onDown.add(function() {
			if(animating == false && gameOver == false) this.forceDropBlocks();
		}, this);
		
		// game over
		gameOver = false;
		gameOverTimer = 0;
		callMatch = false;
		animating = false;
		
		count = 0;
		fallRate = 30;
		
	},
	
	update: function() {
		
		this.count++;
		
		if(gameOver == true) {
			if(this.count < 60) return;
			this.count = 0;
			
			gameOverTimer++;
			if(gameOverTimer < 3) return;
			
			this.game.state.start('MainMenu');
		}
		
		if(this.count < fallRate) return;
		this.count = 0;
		
		if(animating == true) return;
		
		this.stopBlocks();
		
		if(callMatch == true) this.matchBlocks();
		
		this.dropBlocks();
		this.dropNewBlocks();
		this.addBlocks();
	
	},
	
	addBlocks: function() {
		
		if(newBlocks.length > 0) return;
		var topRowEmpty = true;
		
		for(i = 0; i < fallBlocks.length; i++) {
		
			var _group = fallBlocks[i];
			
			if(_group.y - boardY < boardStartLineY) {
				topRowEmpty = false;
			}
		
		}
		
		if(topRowEmpty == false) return;
		
		var _occupiedX = 0;
		
		for(i = 0; i < 2; i++) {
		
			// replenish bags if empty
			if (bagOfColours.length <= 0) {
				bagOfColours = coloursToPick.slice(0);
			}
			if (bagOfLetters.length <= 0) {
				bagOfLetters = lettersToPick.slice(0);
			}
		
			var _posX    = 0;
			
			do {
				var _randomX = this.rnd.integerInRange(0, 4);
				_posX = boardX + boardOffsetX + blockOffsetX + (_randomX * blockWidth);
			} while (_posX == _occupiedX);
			
			_occupiedX = _posX;
		
			var _block   = this.add.group();
			_block.x     = _posX;
			_block.y     = boardY;
		
			var _randomSprite = this.rnd.integerInRange(0, bagOfColours.length);
			var _sprite  = this.add.sprite(0, 0, 'Textures', 'Block' + bagOfColours[_randomSprite] + '.png');
			bagOfColours.splice(_randomSprite,1);
		
			var _randomText = this.rnd.integerInRange(0, bagOfLetters.length);
			var _text    = this.add.text(15, 15, bagOfLetters[_randomText], {font:"24px arial",align:"center", fill:"#ffffff"});
			bagOfLetters.splice(_randomText,1);
	
			_text.anchor.x = Math.round(_text.width * 0.5) / _text.width;
			_text.anchor.y = Math.round(_text.height * 0.5) / _text.height;
		
			_sprite.addChild(_text);
			_block.add(_sprite);
		
			newBlocks.push(_block);
			
		}
		
	},
	
	dropNewBlocks: function() {
	
		if(newBlocks.length <= 0) return;
		if(fallBlocks.length > 0) return;
		if(matchBlocks.length > 0) return;
		
		// check old blocks
		var canMove = true;
		
		for(i = 0; i < newBlocks.length; i++) {
		
			var _group = newBlocks[i];
			
			for(j = 0; j < oldBlocks.length; j++) {
				
				var _group2 = oldBlocks[j];
				
				if(_group2.x == _group.x && _group.y + blockHeight == _group2.y) {
					canMove = false;	
				}
				
			}
			
		}
		
		// don't move if one is stuck - go to gameover
		if(canMove == false) {
			gameOver = true;
			return;
		}
		
		while(newBlocks.length > 0) {
			fallBlocks.push(newBlocks[0]);
			newBlocks.splice(0,1);
		}
		
	},
	
	dropBlocks: function() {
	
		if(fallBlocks.length <= 0) return;
		
		for(i = 0; i < fallBlocks.length; i++) {
		
			var _group = fallBlocks[i];
		
			_group.y += 10;
			
		}
		
	},
	
	forceDropBlocks: function() {
		if(fallBlocks.length <= 0) return;
		
		for(i = 0; i < fallBlocks.length; i++) {
			var _group = fallBlocks[i];
			var _newY  = boardStopLineY + boardY - blockHeight;
			
			for(j = 0; j < oldBlocks.length; j++) {
				
				var _group2 = oldBlocks[j];
				
				if(_group2.x == _group.x) {
				
					if(_group2.y - blockHeight < _newY) {
					
						_newY = _group2.y - blockHeight;
					
					}
				
				}
				
			}
			
			_group.y = _newY;
		}
	},
	
	stopBlocks: function() {
		if(fallBlocks.length <= 0) return;
		
		var _tempFallBlocks = fallBlocks.slice(0);
		var _tempOldBlocks = [];
		
		for(i = 0; i < _tempFallBlocks.length; i++) {
			
			var _group = _tempFallBlocks[i];
			var _stop  = false;
			
			if(_group.y - boardY + blockHeight == boardStopLineY) {
			
				_stop = true
					
			} else {
				
				for(j = 0; j < oldBlocks.length; j++) {
				
					var _group2 = oldBlocks[j];
					
					if(_group.y + blockHeight == _group2.y && _group.x == _group2.x) {
						
						_stop = true
					
					}
				
				}
				
			}
			
			if (_stop == true) {
				_tempOldBlocks.push(_group);
				if(fallBlocks.length > 1) {
					fallBlocks.splice(i,1);
				} else if(fallBlocks.length == 1) {
					fallBlocks.splice(0,1);
				}
			}
			
		}
		
		for(i = 0; i < _tempOldBlocks.length; i++) {
			oldBlocks.push(_tempOldBlocks[i]);
			callMatch = true;
		}
	},
	
	matchBlocks: function() {
		var clearBlocks = [];
		
		oldBlocks.sort(function(a,b) {return ((a.x * 100) +  a.y ) - ((b.x * 100) + b.y)});
		
		var _x = 0;
		var _string = "";
		
		for(i = 0; i < oldBlocks.length; i++) {
			var _group = oldBlocks[i];
			
			if(_group.x != _x) {
				_x = _group.x;
				_string = _group.getAt(0).getChildAt(0).text;
			} else {
				var _oldGroup = oldBlocks[i - 1];
				
				if(_oldGroup.getAt(0).frame == _group.getAt(0).frame) {
					clearBlocks.push(_group);
					clearBlocks.push(_oldGroup);
					
					// clear
					oldBlocks.splice(i,1);
					oldBlocks.splice(i - 1,1);
					
					// add score
					this.addScore(50);
					
					i -= 2; 
					_x = 0;
					_string = "";
				} else {
					_string += _group.getAt(0).getChildAt(0).text;
					
					for(j = 0; j < words.length; j++) {
						if(_string == words[j] || _string == this.reverse(words[j])) {
							var l = 0;
							while(l < words[j].length) {
								clearBlocks.push(oldBlocks[i]);
								oldBlocks.splice(i,1);
								l++;
								i--;
							}
							
							// add score
							if(words[j].length == 3) this.addScore(100);
							if(words[j].length == 4) this.addScore(200);
							if(words[j].length == 5) this.addScore(500);
							
							wordScores[j]++;
							wordScoresText[j].setText(words[j] + " x " + this.pad(wordScores[j],2,"0"));
							
							_x = 0;
							_string = "";
							break;
						}
					}
				}
			}
						
		}
		
		for(i = 0; i < clearBlocks.length; i++) {
			clearBlocks[i].destroy();
		}
		
		callMatch = false;
	},
	
	swapColumns: function(a,b) {
	
		var _col1 = boardX + boardOffsetX + blockOffsetX + (a * blockWidth);
		var _col2 = boardX + boardOffsetX + blockOffsetX + (b * blockWidth);
		
		// move falling block
		for(i = 0; i < fallBlocks.length; i++) {
			var _group = fallBlocks[i];
			
			if(_group.x == _col1 || _group.x == _col2) {
			
				var move = false;
			
				for(j = 0; j < oldBlocks.length; j++) {
					
					var _group2 = oldBlocks[j];
					
					if(_group2.y < _group.y + blockHeight) {
						
						if((_group2.x == _col1 && _group.x == _col2)
						|| (_group2.x == _col2 && _group.x == _col1)) {
							move = true;
							break;
						}
						
					}
					
				}
				
			}
			
			if(move == true) {
				if(_group.x == _col1) {
					_group.x = _col2;
				} else if(_group.x == _col2) {
					_group.x = _col1;
				}
			}
		}
		
		// move old blocks
		for(i = 0; i < oldBlocks.length; i++) {
			
			var _group = oldBlocks[i];
			
			if(_group.x == _col1) {
				_group.x = _col2;
			} else if(_group.x == _col2) {
			 	_group.x = _col1;
			}
			
		}
		
	},
	
	reverse: function(a) {
		var i = a.length;
		var newString = "";
		while(i > 0) {
			newString += a.substring(i - 1, i);
			i--;	
		}
		return newString;
	},
	
	addScore: function(i) {
		gameScore += i;
		gameScoreText.setText("SCORE: " + this.pad(gameScore,7,"0"));
	},
	
	pad: function(n, width, z) {
		z = z || "0";
		n = n + "";
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;		
	}
	
}