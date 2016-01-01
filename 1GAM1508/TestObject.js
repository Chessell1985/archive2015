Shifter = function(game, x, y, direction) {

	Phaser.Sprite.call(this, game, x, y, 'Shifter');
	this.anchor.setTo(0.5, 1);
	this.scale.x =  direction;

	// attributes
	this.active        =      false; // becomes active when spotted
	this.move_timer    =          0; // move timer
	this.move_duration =         60; // how long to move?
	this.move_direction = direction; // which direction to move?
	this.move_speed_x  =        100; // move speed
	this.move_speed_y  =          0; // jump speed
	this.wait_timer    =          0; // wait timer
	this.wait_duration =         30; // how long to wait?
	this.hit_points    =          3;
	this.stun_timer    =          0;
	this.stun_duration =         30;
	this.score_points  =         10; 
	this.is_boss       =      false;

	// for setting physics properties
	this.initiated_physics =  false;

};

Shifter.prototype = Object.create(Phaser.Sprite.prototype);
Shifter.prototype.constructor = Shifter;
Shifter.prototype.update = function() {

	// initiate physics
	if(!this.initiated_physics) {

		this.body.collideWorldBounds = true;
		this.body.setSize(32, 32, 0, 0);
		this.initiated_physics = true;

	}

	// activate
	if(this.inCamera && !this.active) this.active = true;
	
	// move pattern
	if(this.active) {

		if(this.stun_timer == 0) {
			this.alpha = 1.0;
		} else {
			this.stun_timer--;
		}

		if(this.body.onWall()) {

			this.move_direction *= -1;
			this.body.velocity.x *= -1;

		}

		if(this.wait_timer == 0 && this.move_timer == 0) {

			this.body.velocity.x =  (this.move_speed_x * this.move_direction);
			this.scale.x = this.move_direction;
			
			this.move_timer = this.move_duration;

		} else if(this.move_timer > 0) {

			this.move_timer --;

			if(this.move_timer == 0) {
				this.body.velocity.x = 0;
				this.wait_timer = this.wait_duration;
			}

		} else {

			this.wait_timer --;

		}
	}

};