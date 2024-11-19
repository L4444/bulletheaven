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


var enemy = [];

var shiptest;

function preload ()
{
    this.load.image('player','ships/1B.png');
    this.load.image('enemy','ships/8.png');
    this.load.image('back','Backgrounds/Blue Nebula/Blue Nebula 1 - 1024x1024.png');
    this.load.image('pew','pew.png');

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

   
    player = new Ship(this,'player',200,200, false);
    Ship.playerShip = player;

    for(let i = 0;i <1;i++)
    {
       enemy[i] = new Ship(this,'enemy',i * 300, 400,true);
        
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
   // music.play();

    
}



function update ()
{

    
   
    // Basic controls, BIG thrust is the engine that player directly controls, LITTLE thrust is for indirectly controlled to prevent drift.
  
    if(keys.D.isDown) {player.right();}
    if(keys.A.isDown) {player.left();}

    if(keys.W.isDown) {player.forward();}
    if(keys.S.isDown) {player.back();}
    

  

   

   



    // Angle the ship to "look at" the cursor, Cursor aiming
    let targetAngle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(player.sprite.x, player.sprite.y, game.input.mousePointer.x,game.input.mousePointer.y)
       ) + 90; // The +90 is to ensure it points forward rather than to the right.
    

    

    // TEST: Just set it
    player.sprite.angle = targetAngle;

    // Present debug info
    infoText.setText("Big thrust is " + Ship.BIG_THRUST + "\nand Little thrust is " + Ship.LITTLE_THRUST 
    + "\nVelX = " + player.sprite.body.velocity.x + "\nVelY = " + player.sprite.body.velocity.y + 
     "\ntX: " + player.tX + "\ntY: " + player.tY +
     "\nCursorX: " + game.input.mousePointer.x + "\nCursorY: " + game.input.mousePointer.y + 
    "\ntargetAngle: " + targetAngle + "\nPlayer Angle: " + player.sprite.angle);
    
    
    player.update();

    for(let i = 0;i < enemy.length;i++)
    {
        enemy[i].update();
    }


    // Cheesy scrolling background
    background.tilePositionY -= 2;

}