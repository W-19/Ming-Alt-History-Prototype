// Structure taken from https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
var Enemy1 = new Phaser.Class({
	Extends: Phaser.GameObjects.Image,

    initialize:

    function Enemy1(scene, x, y){
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy1-temp');

		this.moveSpeed = 2;

		// I guess we can set the spawnpoint like this?
		this.x = x;
		this.y = y;
		//this.health = 3;
    },

    update: function(){
		// Move towards the player
		this.setPosition(this.x + this.moveSpeed*(this.x < player.x ? 1 : -1), this.y + this.moveSpeed*(this.y < player.y ? 1 : -1));
    },

	touchPlayer: function(){
		console.log("contact");
	}
});
