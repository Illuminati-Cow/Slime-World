class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    init() {
        this.VEL = 100  // slime velocity constant
    }

    preload() {
        this.load.path = './assets/'
        this.load.spritesheet('slime', 'slime.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('tileset', 'tileset.png');
        this.load.tilemapTiledJSON('overworld-json', 'overworld.json');
    }

    create() {
        // Add tilemap
        const tileMap = this.add.tilemap('overworld-json');
        const mapWidth = tileMap.width * tileMap.tileWidth;
        const mapHeight = tileMap.height * tileMap.tileHeight
        const tileMapImage = tileMap.addTilesetImage('terrain', 'tileset');
        const bgLayer = tileMap.createLayer('Background', tileMapImage, 0, 0);
        const terrainLayer = tileMap.createLayer('Terrain', tileMapImage, 0, 0).setDepth(1);
        terrainLayer.setCollisionByProperty({collidable:true});
        const slimeSpawn = tileMap.findObject('Spawns', (object) => object.name === 'SlimeSpawn')
        // add slime
        this.slime = this.physics.add.sprite(32, 32, 'slime', 0);
        this.slime.setPosition(slimeSpawn.x, slimeSpawn.y);
        this.slime.body.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.slime, false, .25, .25);
        this.cameras.main.zoom = 1.25;
        // slime animation
        this.anims.create({
            key: 'jiggle',
            frameRate: 2,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('slime', {start: 0, end: 1}),
        });
        this.slime.play('jiggle');
        // input
        this.cursors = this.input.keyboard.createCursorKeys();
        // Collisions
        this.physics.add.collider(this.slime, terrainLayer);
    }

    update() {
        // slime movement
        this.direction = new Phaser.Math.Vector2(0)
        if(this.cursors.left.isDown) {
            this.direction.x = -1
        } else if(this.cursors.right.isDown) {
            this.direction.x = 1
        }

        if(this.cursors.up.isDown) {
            this.direction.y = -1
        } else if(this.cursors.down.isDown) {
            this.direction.y = 1
        }

        this.direction.normalize()
        this.slime.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y)
    }
}