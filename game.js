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

var menuMusic;
var battleMusic;
var sneakMusic;
var bossMusic;

var shootSound;

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

    // load music
    this.load.audio('menu','music/Menu.wav');
    this.load.audio('battle','music/Sutar Rising.mp3');
    this.load.audio('sneak', 'music/Brought to life.mp3');
    this.load.audio('boss','music/Power Trip 3.mp3');

    // load SFX
    this.load.audio('shoot1','sounds/alienshoot1.wav');
    this.load.audio('shoot2','sounds/alienshoot2.wav');

}

function create ()
{
    background = this.add.tileSprite(500,500,1024,1024,'back');
   
    


 
    // Create music objects
    menuMusic = this.sound.add('menu', {loop: true});

    battleMusic = this.sound.add('battle', {loop: true});
    battleMusic.volume = 0.1;

    //sneakMusic = this.sound.add('sneak', {loop: true});
    //sneakMusic.volume = 0.1;

    bossMusic = this.sound.add('boss', {loop: true});
    bossMusic.volume = 0.1;

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
   

    keys = this.input.keyboard.addKeys('W,S,A,D,F,E,Q,UP,DOWN,SPACE,F1');
    infoText = this.add.text(10,30,"");
    helpText = this.add.text(10,10,"Press F1 to toggle help");


   

    // Toggle the help for controls and debug. Also control music
    this.input.keyboard.on('keyup-F1',function(event) {infoText.visible = !infoText.visible;})
    this.input.keyboard.on('keyup-ONE',function(event) { if(!menuMusic.isPlaying) { this.game.sound.stopAll(); menuMusic.play();}})
    this.input.keyboard.on('keyup-TWO',function(event) { if(!battleMusic.isPlaying) { this.game.sound.stopAll(); battleMusic.play();}})
    this.input.keyboard.on('keyup-THREE',function(event) { if(!sneakMusic.isPlaying) { this.game.sound.stopAll(); sneakMusic.play();}})
    this.input.keyboard.on('keyup-FOUR',function(event) { if(!bossMusic.isPlaying) { this.game.sound.stopAll(); bossMusic.play();}})

   
    
    

  
}



function update ()
{

    
   
    // Basic controls, BIG thrust is the engine that player directly controls, LITTLE thrust is for indirectly controlled to prevent drift.
    if(keys.D.isDown) {player.right();}
    if(keys.A.isDown) {player.left();}

    if(keys.W.isDown) {player.forward();}
    if(keys.S.isDown) {player.back();}
    
    if(game.input.mousePointer.buttons == 1) { player.shoot();}

    // boom controls
    if(keys.SPACE.isDown) {explosion.play('explode');}

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
    + "\nleft click for shoot \n1 for menu music \n2 for battle music \n3 for stealth music \n4 for boss music \nUP, DOWN, E and Q to play with physics");
    

    
    player.update();

    for(let i = 0;i < enemy.length;i++)
    {
        enemy[i].update();
    }


    // Cheesy scrolling background
    background.tilePositionY -= 2;

}