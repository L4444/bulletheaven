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
                //debug: true // Show the wireframes and velocity 
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

var keys;
var explosion;

var battleMusic;
var menuMusic;


var enemy = [];

var infoText;
var helpText;

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
    this.load.audio('battle','Sutar Rising.mp3');
    this.load.audio('sneak', 'Brought to Life.mp3');
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

   
    player = new Ship(this,'player',400,850, false);
    Ship.playerShip = player;

    for(let i = 0;i <4;i++)
    {
       enemy[i] = new Ship(this,'enemy',300, i*130+80,true);
        
    }
   

    keys = this.input.keyboard.addKeys('W,S,A,D,F,E,Q,UP,DOWN,SPACE,F1,1,2,3,4');
    infoText = this.add.text(10,30,"");
    helpText = this.add.text(10,10,"Press F1 to toggle help");


    

    // Toggle the help for controls and debug
    this.input.keyboard.on('keyup-F1',function(event) {infoText.visible = !infoText.visible;})

   
    battleMusic = this.sound.add('battle', {loop: true})
    battleMusic.volume = 0.1;
    

    menuMusic = this.sound.add('menu', {loop: true})
    

  
}



function update ()
{

    
   
    // Basic controls, BIG thrust is the engine that player directly controls, LITTLE thrust is for indirectly controlled to prevent drift.
    if(keys.D.isDown) {player.right();}
    if(keys.A.isDown) {player.left();}

    if(keys.W.isDown) {player.forward();}
    if(keys.S.isDown) {player.back();}
    
    if(game.input.mousePointer.buttons == 1) {player.shoot();}

    // Music controls
    if(keys.F.isDown && !menuMusic.isPlaying) {menuMusic.play(); battleMusic.stop();}

    if(keys.SPACE.isDown && !battleMusic.isPlaying)
        {
        menuMusic.stop();
        battleMusic.play();
        explosion.play('explode');
        }

        // Game design controls.
        if(keys.UP.isDown) {Ship.BIG_THRUST += 100;}
        if(keys.DOWN.isDown) {Ship.BIG_THRUST -= 100;}
        if(keys.E.isDown) { Ship.LITTLE_THRUST += 0.1;;}
        if(keys.Q.isDown) { Ship.LITTLE_THRUST -= 0.1;}
            
    

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
    "\ntargetAngle: " + targetAngle + "\nPlayer Angle: " + player.sprite.angle + 
    "\nMousebuttons: " + game.input.mousePointer.buttons + "\n------------Controls---------- \nW,S,A,D for movement" 
    + "\nleft click for shoot \nF for menu music \nSpacebar for battle music \nUP, DOWN, E and Q to play with physics");
    

    
    player.update();

    for(let i = 0;i < enemy.length;i++)
    {
        enemy[i].update();
    }


    // Cheesy scrolling background
    background.tilePositionY -= 2;

}