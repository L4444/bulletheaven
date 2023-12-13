var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    physics: {
            default: 'arcade',
            arcade: {
                x: 0,
                y: 0,
                width: 900,
                height: 900,
                debug: true
            }
        },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var background;
var infoText;
var keys;
var explosion;
var music;
var BIG_THRUST = 1000;
var LITTLE_THRUST = 5.0;

var enemy = [];


function preload ()
{
    this.load.image('player','ships/1B.png');
    this.load.image('enemy','ships/8.png');
    this.load.image('back','Backgrounds/Blue Nebula/Blue Nebula 1 - 1024x1024.png');

    var u;
    for(var i = 0; i <15; i++)
    {
        u = (i + 1).toString().padStart(4,'0');
        
    this.load.image('boom' + i, 'effects/explosion4/k2_' + u + '.png');
    }

    this.load.audio('menu','Menu.wav');
}

function create ()
{
    background = this.add.tileSprite(500,500,1024,1024,'back');
   
    


    var f = [];
    for( var i = 0; i < 15; i++)
    {
        f[i] = {key: 'boom' + i};
    }
    this.anims.create({key: 'explode', frames:f, frameRate: 30, repeat: 0});

    explosion = this.add.sprite(400,400, 'boom14');
    explosion.setScale(0.25);

    player = this.physics.add.sprite(40,400, 'player');
    player.body.setCollideWorldBounds(true);
    player.setScale(0.5);

    for(let i = 0;i <3;i++)
    {
        enemy[i] = this.physics.add.sprite(400 * i,400, 'enemy');
        enemy[i].body.setCollideWorldBounds(true);
        enemy[i].setScale(0.5);
        enemy[i].angle = 180;
    }
   

    keys = this.input.keyboard.addKeys('W,S,A,D,F');
    infoText = this.add.text(0,0,"");

    this.input.keyboard.on('keydown-UP', function (event) {
        BIG_THRUST += 100;
    });

    this.input.keyboard.on('keydown-DOWN', function (event) {
        BIG_THRUST -= 100;
    });

    this.input.keyboard.on('keydown-E', function (event) {
        LITTLE_THRUST += 0.1;
    });

    this.input.keyboard.on('keydown-Q', function (event) {
        LITTLE_THRUST -= 0.1;
    });

    this.input.keyboard.on('keydown-SPACE', function(event)
        {
            explosion.play('explode');
        });

        music = this.sound.add('menu', {loop: true})
        music.play();
}



function update ()
{
    var tX = 0;
    var tY = 0;
    
   
    // Basic controls, BIG thrust is the engine that player directly controls, LITTLE thrust is for indirectly controlled to prevent drift.
    if(keys.D.isDown) {tX = BIG_THRUST;}
    if(keys.A.isDown) {tX = -BIG_THRUST;}
    if(keys.W.isDown) {tY = -BIG_THRUST;}
    if(keys.S.isDown) {tY = BIG_THRUST;}
    

  
    // If we aren't using the big thruster, activate the little thruster to slow us down and prevent drift.... if our X velocity is really small, just 
    // "apply the handbrake", setting velocity to zero
    if(tX == 0)
    {
        if(Math.abs(player.body.velocity.x) > 1)
        {
            tX = player.body.velocity.x * -LITTLE_THRUST; 
            
        }
        else
        {
            player.setVelocityX(0);
            
        }
        
    }
    // Same as above, but for Y axis, not sure if I should make this into a function.
    if(tY == 0)
    {
        if(Math.abs(player.body.velocity.y) > 1)
        {
            tY = player.body.velocity.y * -LITTLE_THRUST; 
        }
        else
        {
            player.setVelocityY(0);
        }
    }

/// Speed cap
    if(player.body.velocity.x > 400) {player.setVelocityX(400);tX = 0;}
    if(player.body.velocity.x < -400) {player.setVelocityX(-400);tX = 0;}


    // Activate big thruster!
    player.setAcceleration(tX,tY);



    // Angle the ship to "look at" the cursor, Cursor aiming
    let targetAngle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(player.x, player.y, game.input.mousePointer.x,game.input.mousePointer.y)
        ) + 90; // The +90 is to ensure it points forward rather than to the right.
    

    

    // TEST: Just set it
    player.angle = targetAngle;

    // Present debug info
    infoText.setText("Big thrust is " + BIG_THRUST + "\nand Little thrust is " + LITTLE_THRUST + "\nVelX = " + player.body.velocity.x + "\nVelY = " + player.body.velocity.y
    + "\nCursorX: " + game.input.mousePointer.x + "\nCursorY: " + game.input.mousePointer.y + "\ntargetAngle: " + targetAngle + "\nPlayer Angle: " + player.angle);

    


    // Cheesy scrolling background
    background.tilePositionY -= 2;

}