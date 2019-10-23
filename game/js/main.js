// Set up game
var config = {
    width: 800,
    height: 600,
    renderer: Phaser.AUTO,
    antialias: true,
    multiTexture: true,
    physics: {
        default: 'arcade',
        arcade: {debug: false}
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var background;
var player;
var enemies;
var controls;

function preload() {
    // Load the images, spritesheets, tilemaps, and audio; whatever we need for this prototype. Examples below.

    this.load.image('background', 'assets/img/CoC field.png');
    this.load.spritesheet('player', 'assets/img/player_anim.png', {frameWidth: 50, frameHeight: 50});
    //game.load.tilemap('level', 'assets/tilemaps/FinalTilemap2.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.audio('game music', 'assets/audio/Old GB Song.ogg');

}

function create() {

    background = this.physics.add.image(config.width/2, config.height/2, 'background');
	background.setOrigin(0.5, 0.5);
    background.setImmovable(true);

    player = this.physics.add.sprite(config.width/2, config.height/2, 'player');
	player.setOrigin(0.5, 0.5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

	enemies = this.physics.add.group({classType: Enemy1, runChildUpdate: true});
	testEnemy = enemies.create(200, 200);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{key: 'player', frame: 2}],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {start: 4, end: 4}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', {start: 1, end: 1}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', {start: 3, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    controls = this.input.keyboard.createCursorKeys();

    //this.physics.add.collider(player, background);

}

function update() {

	if(controls.left.isDown && !controls.right.isDown){ // moving left
		if(background.x - background.width/2 < 0 && !(player.x > config.width/2)){ // move the background
			background.setVelocityX(160);
			player.setVelocityX(0);
		}
		else{ // move the player
			background.setVelocityX(0);
			player.setVelocityX(-160);
		}

		player.anims.play('left', true);
	}
	else if(controls.right.isDown){ // moving right
		if(background.x > background.width - config.width && !(player.x < config.width/2)){
			background.setVelocityX(-160);
			player.setVelocityX(0);
		}
		else{
			background.setVelocityX(0);
			player.setVelocityX(160);
		}

		player.anims.play('right', true);
	}
	else {
		background.setVelocityX(0);
        player.setVelocityX(0);
    }

	if(controls.up.isDown && !controls.down.isDown){ // moving up
		if(background.y - background.height/2 < 0 && !(player.y > config.height/2)){
			background.setVelocityY(120);
			player.setVelocityY(0);
		}
		else{
			background.setVelocityY(0);
			player.setVelocityY(-120);
		}

		player.anims.play('up', true);
	}
	else if(controls.down.isDown){ // moving down
		if(background.y + background.height/2 > config.height && !(player.y < config.height/2)){
			background.setVelocityY(-120);
			player.setVelocityY(0);
		}
		else{
			background.setVelocityY(0);
			player.setVelocityY(120);
		}

		player.anims.play('down', true);
	}
	else {
		background.setVelocityY(0);
        player.setVelocityY(0);
    }

	if (!controls.up.isDown && !controls.down.isDown && !controls.right.isDown && !controls.left.isDown) {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn', true)
    }
	else if((controls.left.isDown || controls.right.isDown) && (controls.up.isDown || controls.down.isDown)){
		// it's not "velocity.(x/y) /= sqrt(2)" because vertical movement is 25% less than horizontal movement.
		// 0.82 is just an approximation of what it should be; idk how to calculate the correct amount.
		// also, the else-if above can't just use velocities since sometimes it's the BG that's moving.
		player.body.velocity.x *= 0.82;
		player.body.velocity.y *= 0.82;
	}
}
