var map;
var layer;
var cursors;
var tileSize = 8;
var mapWidth = 250;
var mapHeight = 250;
var moveSpeed = 10;

var game = new Phaser.Game(tileSize * mapWidth, tileSize * mapHeight, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('map', 'battlefield.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'img/terrain_small.png');
}

function create() {
    map = game.add.tilemap('map', 8, 8);
    map.addTilesetImage('tiles');
    layer = map.createLayer(0);
    layer.resizeWorld();

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
        game.camera.x -= moveSpeed;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += moveSpeed;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= moveSpeed;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += moveSpeed;
    }

}

function render() {

}