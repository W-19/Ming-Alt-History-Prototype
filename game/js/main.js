/*
 * This is the main file for the Greenhouse Granny game.
 * Developers: Simon Katzer, Jack Cuneo, Matthew Tolentino, Trystan Nguyen
 * Our repo is here: https://github.com/W-19/ARTG120-Project/tree/master/greenhouse_granny
 */

// Set up game
var config = {
	width: 800,
	height: 600,
	renderer: Phaser.AUTO,
	antialias: true,
	multiTexture: true,
	scene: {
        preload: preload,
        create: create,
        update: update
    }
}
var game = new Phaser.Game(config);

function preload(){
	// Load the images, spritesheets, tilemaps, and audio; whatever we need for this prototype. Examples below.

	//game.load.image('shovel', shovel.path);

	//game.load.spritesheet('granny', 'assets/img/SpriteSheets/Gardener_NEW_SpriteSheet.png', 102, 148);

	//game.load.tilemap('level', 'assets/tilemaps/FinalTilemap2.json', null, Phaser.Tilemap.TILED_JSON);

	//game.load.audio('game music', 'assets/audio/Old GB Song.ogg');

}

function create(){
	this.add.text(16, 16, "Phaser loaded correctly!", {fontSize:'32px', fill:'#333'});
}

function update(){

}
