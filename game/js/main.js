// Set up game
var config = {
    width: 800,
    height: 600,
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
var PLAYER_MS = 160; // ms = MoveSpeed
var enemies;
var controls;
var cursors;
var scene = 0;

function preload() {
    // Load the images, spritesheets, tilemaps, and audio; whatever we need for this prototype. Examples below.

    this.load.image('background', 'assets/img/city_building.png');
    this.load.spritesheet('characters', 'assets/img/characters.png', {frameWidth: 100, frameHeight: 100});
    //this.load.atlas('characters', 'assets/img/characters.png', 'assets/img/characters.json');
    this.load.image('enemy1-temp', 'assets/img/enemy1.png')
    //game.load.tilemap('level', 'assets/tilemaps/FinalTilemap2.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.audio('game music', 'assets/audio/Old GB Song.ogg');

}

function create() {

    cursors = this.input.keyboard.addKey('Enter');

    background = this.physics.add.image(config.width / 2, config.height / 2, 'background');
    background.setOrigin(0.5, 0.5);
    background.setImmovable(true);

    player = this.physics.add.sprite(config.width / 2, config.height / 2, 'characters');
    player.setOrigin(0.5, 0.5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    enemies = this.physics.add.group({classType: Enemy1, runChildUpdate: true});
    testEnemy = enemies.create(200, 200);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('characters', {start: 11, end: 11}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{key: 'characters', frame: 8}],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('characters', {start: 5, end: 6}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('characters', {start: 15, end: 16}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('characters', {start: 3, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    controls = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, enemies);

}

function update() {
    if (this.input.keyboard.checkDown(cursors, 1000) && scene === 0) {
        changeScenes(this);
    }

    if (controls.left.isDown && !controls.right.isDown) { // moving left
        if (background.x - background.width / 2 < 0 && !(player.x > config.width / 2)) { // move the background
            background.setVelocityX(PLAYER_MS);
            player.setVelocityX(0);
        } else { // move the player
            background.setVelocityX(0);
            player.setVelocityX(-PLAYER_MS);
        }

        player.anims.play('left', true);
    } else if (controls.right.isDown) { // moving right
        if (background.x + background.width / 2 > config.width && !(player.x < config.width / 2)) {
            background.setVelocityX(-PLAYER_MS);
            player.setVelocityX(0);
        } else {
            background.setVelocityX(0);
            player.setVelocityX(PLAYER_MS);
        }

        player.anims.play('right', true);
    } else {
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

        player.anims.play('up', true);
    } else if (controls.down.isDown) { // moving down
        if (background.y + background.height / 2 > config.height && !(player.y < config.height / 2)) {
            background.setVelocityY(-PLAYER_MS * 0.75);
            player.setVelocityY(0);
        } else {
            background.setVelocityY(0);
            player.setVelocityY(PLAYER_MS * 0.75);
        }

        player.anims.play('down', true);
    } else {
        background.setVelocityY(0);
        player.setVelocityY(0);
    }

    if (!controls.up.isDown && !controls.down.isDown && !controls.right.isDown && !controls.left.isDown) {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn', true)
    } else if ((controls.left.isDown || controls.right.isDown) && (controls.up.isDown || controls.down.isDown)) {
        // it's not "velocity.(x/y) /= sqrt(2)" because vertical movement is 25% less than horizontal movement.
        // 0.82 is just an approximation of what it should be; idk how to calculate the correct amount.
        // also, the else-if above can't just use velocities since sometimes it's the BG that's moving.
        player.body.velocity.x *= 0.82;
        player.body.velocity.y *= 0.82;
    }

    function changeScenes(game) {
        game.cameras.main.once('camerafadeoutcomplete', function (camera) {
            camera.fadeIn(6000);
        });
        scene = 1;
        game.cameras.main.fadeOut(3000);
    }
}
