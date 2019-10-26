// Structure taken from https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
var Enemy1 = new Phaser.Class({
	Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Enemy1(scene, x, y){
        Phaser.GameObjects.Sprite.call(this, scene, x, y, 'enemy1');

		this.moveSpeed = 50;

		// I guess we can set the spawnpoint like this?
		this.x = x;
		this.y = y;
		this.health = 7;
    },

    update: function(){
		// Move towards the player
		this.body.setVelocity(
				this.moveSpeed*(this.x < player.x ? 1 : -1) + background.body.velocity.x,
				this.moveSpeed*(this.y < player.y ? 0.75 : -0.75) + background.body.velocity.y
		);

		// This assumes that there's no vertical squash and that the enemy is moving
		// directly towards the player... I'll fix this later
		let relativeVX = this.body.velocity.x - background.body.velocity.x;
		let relativeVY = this.body.velocity.y - background.body.velocity.y;
		if(relativeVX < 0 && -relativeVX > Math.abs(relativeVY)){
			this.anims.play('enemy1 left');
		}
		else if(relativeVX > Math.abs(relativeVY)){
			this.anims.play('enemy1 right');
		}
		else if(relativeVY < 0 && -relativeVY > Math.abs(relativeVX)){
			this.anims.play('enemy1 up');
		}
		else{
			this.anims.play('enemy1 down');
		}


		//console.log(this.tintTopLeft.toString(16));
		// I had to make this monstrisity because apparently you can't just increment the value
		switch(this.tintTopLeft){ // Oh yeah, and you can't read from tint directly either
			case 0x3333ff: this.tint = 0xff4444; break;
			case 0x4444ff: this.tint = 0xff5555; break;
			case 0x5555ff: this.tint = 0xff6666; break;
			case 0x6666ff: this.tint = 0xff7777; break;
			case 0x7777ff: this.tint = 0xff8888; break;
			case 0x8888ff: this.tint = 0xff9999; break;
			case 0x9999ff: this.tint = 0xffaaaa; break;
			case 0xaaaaff: this.tint = 0xffbbbb; break;
			case 0xbbbbff: this.tint = 0xffcccc; break;
			case 0xccccff: this.tint = 0xffdddd; break;
			case 0xddddff: this.tint = 0xffeeee; break;
			case 0xeeeeff: this.tint = 0xffffff; break;
		}
    },

	takeDamage: function(amount, source){
		// knockback here?
		this.tint = 0xff3333;
		this.health -= amount;
		if(this.health <= 0){
			this.destroy();
		}
	}
});
