OrangeJumper = function(game, x, y, direction) {
		
	Phaser.Sprite.call(this, game, x, y, 'OrangeJumper');
	this.anchor.setTo(0.5, 0.5);
	this.scale.x =  direction;

	this.animations.add('Chomping');

	// for setting physics properties
	this.initiated_physics =  false;
	this.active = false;

};
OrangeJumper.prototype = Object.create(Phaser.Sprite.prototype);
OrangeJumper.prototype.constructor = OrangeJumper;
OrangeJumper.prototype.update = function() {

	if (!this.initiated_physics) {

		this.body.collideWorldBounds = true;
		this.body.setSize(16, 16, 0, 0);
		this.body.gravity.y = 800;
		this.initiated_physics = true;
		this.animations.play('Chomping', 5, true, false);

	}

	// activate
	if(!this.active) this.active = true;
	
	// move pattern
	if(this.active) {

		if(this.body.onFloor()) {

			this.body.velocity.y =  -250; 

		} 
	}

};
