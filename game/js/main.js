// Set up game
var config = {
    width: 800,
    height: 600,
	parent: 'canvas-holder',
    renderer: Phaser.AUTO,
    antialias: true,
    multiTexture: true,
    physics: {
        default: 'arcade',
        arcade: {debug: true}
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
var PLAYER_MS = 320; // ms = MoveSpeed
var PLAYER_ATTACK_DURATION = 60;
var enemies;
var controls;
var keyAttack;
var playerAttackCooldown = 0;
var cursors;
var scene = 0;

function preload() {
    // Load the images, spritesheets, tilemaps, and audio; whatever we need for this prototype. Examples below.

    this.load.image('background', 'assets/img/city street & buildings.png');
	this.load.spritesheet('player', 'assets/img/player.png', {frameWidth: 100, frameHeight: 100});
	this.load.spritesheet('enemy1', 'assets/img/enemy.png', {frameWidth: 100, frameHeight: 100});
    //this.load.atlas('characters', 'assets/img/characters.png', 'assets/img/characters.json');
    //this.load.image('enemy1-temp', 'assets/img/enemy1.png')
    //game.load.audio('game music', 'assets/audio/Old GB Song.ogg');

}

function create() {
    cursors = this.input.keyboard.addKey('Enter');

    background = this.physics.add.image(config.width / 2, config.height / 2, 'background');
    background.setOrigin(0.5, 0.5);
    background.setImmovable(true);

    player = this.physics.add.sprite(config.width / 2, config.height / 2, 'player');
	player.setSize(40, 90); // make the hitbox more closely match the actual player
    player.setOrigin(0.5, 0.5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    enemies = this.physics.add.group({classType: Enemy1, runChildUpdate: true});
    enemy1_1 = enemies.create(200, 200);
	enemy1_1.setOrigin(-0.5, -0.5);

    this.anims.create({
        key: 'player left',
        frames: this.anims.generateFrameNumbers('player', {start: 8, end: 11}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'player right',
        frames: this.anims.generateFrameNumbers('player', {start: 12, end: 15}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'player up',
        frames: this.anims.generateFrameNumbers('player', {start: 2, end: 4}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'player down',
        frames: this.anims.generateFrameNumbers('player', {start: 5, end: 7}),
        frameRate: 10,
        repeat: -1
    });
	this.anims.create({
        key: 'player attack',
        frames: this.anims.generateFrameNumbers('player', {start: 0, end: 1}),
        frameRate: Math.floor(2*(PLAYER_ATTACK_DURATION/60)),
        repeat: -1
    });
	player.anims.play('player down', true);

	this.anims.create({
		key: 'enemy1 left',
		frames: this.anims.generateFrameNumbers('enemy1', {start: 6, end: 8}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'enemy1 right',
		frames: this.anims.generateFrameNumbers('enemy1', {start: 9, end: 11}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'enemy1 up',
		frames: this.anims.generateFrameNumbers('enemy1', {start: 0, end: 2}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'enemy1 down',
		frames: this.anims.generateFrameNumbers('enemy1', {start: 3, end: 5}),
		frameRate: 10,
		repeat: -1
	});

    controls = this.input.keyboard.createCursorKeys();
	keyAttack = this.input.keyboard.addKey('F');

    this.physics.add.collider(player, enemies);

}

function update() {
	// Changing scenes
    if (this.input.keyboard.checkDown(cursors, 1000) && scene === 0) {
        changeScenes(this);
    }

	// Attacking
	if (playerAttackCooldown == 0 && Phaser.Input.Keyboard.JustDown(keyAttack)){
		playerAttackCooldown = PLAYER_ATTACK_DURATION;
		player.setVelocityX(0);
		player.setVelocityY(0);
		background.setVelocityX(0);
		background.setVelocityY(0);
		player.anims.play('player attack');
    }

	// Moving (only if not on attack cooldown)
	if(playerAttackCooldown > 0){
		if(playerAttackCooldown == PLAYER_ATTACK_DURATION){
			// Slash attack around the player
			enemies.getChildren().forEach(function(enemy){
				if(Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y) < 100){
					enemy.takeDamage(2, player);
				}
			});
		}
		else if(playerAttackCooldown == Math.floor(PLAYER_ATTACK_DURATION/2)){
			// Punch attack to the right of the player
			enemies.getChildren().forEach(function(enemy){
				if(Math.abs(enemy.y-player.y) < enemy.height/2 + player.height/2 && enemy.x > player.x && enemy.x < player.x + 150){
					enemy.takeDamage(4, player);
				}
			});
		}
		else if(playerAttackCooldown == 1){
			player.anims.play('player down', true);
		}
		playerAttackCooldown--;
	}
	else{
		processPlayerMovement();
	}
}

function processPlayerMovement(){
	if(controls.left.isDown && !controls.right.isDown){ // moving left
		if(background.x - background.width/2 < 0 && !(player.x > config.width/2)){ // move the background
			background.setVelocityX(PLAYER_MS);
			player.setVelocityX(0);
		}
		else{ // move the player
			background.setVelocityX(0);
			player.setVelocityX(-PLAYER_MS);
		}

		player.anims.play('player left', true);
	}
	else if(controls.right.isDown){ // moving right
		if(background.x + background.width/2 > config.width && !(player.x < config.width/2)){
			background.setVelocityX(-PLAYER_MS);
			player.setVelocityX(0);
		}
		else{
			background.setVelocityX(0);
			player.setVelocityX(PLAYER_MS);
		}

		player.anims.play('player right', true);
	}
	else {
		background.setVelocityX(0);
        player.setVelocityX(0);
    }

    if (controls.up.isDown && !controls.down.isDown) { // moving up
        if (background.y - background.height / 2 < 0 && !(player.y > config.height / 2)) {
            background.setVelocityY(PLAYER_MS * 0.75);
            player.setVelocityY(0);
        } else {
            background.setVelocityY(0);
            player.setVelocityY(-PLAYER_MS * 0.75);
        }

        if(!controls.left.isDown && !controls.right.isDown) player.anims.play('player up', true);
    } else if (controls.down.isDown) { // moving down
        if (background.y + background.height / 2 > config.height && !(player.y < config.height / 2)) {
            background.setVelocityY(-PLAYER_MS * 0.75);
            player.setVelocityY(0);
        } else {
            background.setVelocityY(0);
            player.setVelocityY(PLAYER_MS * 0.75);
        }

        if(!controls.left.isDown && !controls.right.isDown) player.anims.play('player down', true);
    } else {
        background.setVelocityY(0);
        player.setVelocityY(0);
    }

    if (!controls.up.isDown && !controls.down.isDown && !controls.right.isDown && !controls.left.isDown) {
        player.setVelocityX(0);
        player.setVelocityY(0);
		player.anims.setProgress(0);
		player.anims.stop();
    } else if ((controls.left.isDown || controls.right.isDown) && (controls.up.isDown || controls.down.isDown)) {
        // it's not "velocity.(x/y) /= sqrt(2)" because vertical movement is 25% less than horizontal movement.
        // 0.82 is just an approximation of what it should be; idk how to calculate the correct amount.
        // also, the else-if above can't just use velocities since sometimes it's the BG that's moving.
        player.body.velocity.x *= 0.82;
        player.body.velocity.y *= 0.82;
		background.body.velocity.x *= 0.82;
		background.body.velocity.y *= 0.82;
    }

	// Bounce the player out of the buildings
	if(playerInsideBuildings()){
		//console.log("Player is in the buildings!");
		if(player.x < background.x){
			player.setVelocityX(PLAYER_MS * 0.4);
			player.setVelocityY(PLAYER_MS * 0.3);
		}
		else{
			player.setVelocityX(-PLAYER_MS * 0.4);
			player.setVelocityY(-PLAYER_MS * 0.3);
		}
	}
}

// Checks whether the player is in the top-left and bottom right triangles, from points covering
// 50% of horizontal and 70% of vertical
function playerInsideBuildings(){
	return (player.x < background.x && player.y < background.y+background.height*0.2 &&
			Phaser.Math.Angle.Between(background.x, background.y-background.height/2, player.x, player.y) >
			Phaser.Math.Angle.Between(background.x, background.y-background.height/2, background.x-background.width/2, background.y+background.height*0.2))
			||
			(player.x > background.x && player.y > background.y-background.height*0.2 &&
			/*
			Phaser.Math.Angle.Between(background.x, background.y+background.height/2, player.x, player.y) <
			Phaser.Math.Angle.Between(background.x, background.y+background.height/2, background.x+background.width/2, background.y-background.height*0.2))
			*/
			player.y > -1*(player.x-background.x)+(background.y+background.height/2)) // simple mx+b to replace the angle thing above
			;
}

function changeScenes(game) {
	game.cameras.main.once('camerafadeoutcomplete', function (camera) {
		camera.fadeIn(6000);
	});
	scene = 1;
	game.cameras.main.fadeOut(3000);
}
