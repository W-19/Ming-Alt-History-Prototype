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
var controls;

function preload() {
    // Load the images, spritesheets, tilemaps, and audio; whatever we need for this prototype. Examples below.

    //game.load.image('shovel', shovel.path);
    this.load.image('background', 'img/background.png');
    //game.load.spritesheet('granny', 'assets/img/SpriteSheets/Gardener_NEW_SpriteSheet.png', 102, 148);
    this.load.spritesheet('player', 'img/player_anim.png', {frameWidth: 50, frameHeight: 50});
    //game.load.tilemap('level', 'assets/tilemaps/FinalTilemap2.json', null, Phaser.Tilemap.TILED_JSON);

    //game.load.audio('game music', 'assets/audio/Old GB Song.ogg');

}

function create() {

    background = this.physics.add.image(0, 0, 'background').setOrigin(0, 0);
    background.setSize(800, 200, true).setOffset(0, 0);
    background.setImmovable(true);

    player = this.physics.add.sprite(50, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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

    this.physics.add.collider(player, background);


}

function update() {

    if (controls.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);

    } else if (controls.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);

    } else {
        player.setVelocityX(0);
    }

    if (controls.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('up', true);

    } else if (controls.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('down', true);

    } else {
        player.setVelocityY(0);
    }

    if (!controls.up.isDown && !controls.down.isDown && !controls.right.isDown && !controls.left.isDown) {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn', true)
    }
}
