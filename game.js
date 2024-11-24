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
var enemy = [];
var background;

var keys;
var explosion;

var menuMusic;
var battleMusic;
var sneakMusic;
var bossMusic;

var shootSound;



var infoText;
var helpText;
var pauseText;
var pauseShade;
var gameLogo;

const state = {
 Menu: 'Menu',
 Gameplay: 'Gameplay'
}

var gameState;

function preload ()
{
    this.load.image('player','ships/1B.png');
    this.load.image('enemy1','ships/2.png');
    this.load.image('enemy2','ships/3.png');
    this.load.image('enemy3','ships/8.png');
    this.load.image('enemy4','ships/10.png');

    this.load.image('back','Backgrounds/Blue Nebula/Blue Nebula 1 - 1024x1024.png');
    this.load.image('menuBack','Backgrounds/Green Nebula/Green Nebula 7 - 1024x1024.png');
    this.load.image('logo','Ratspace Logo.png');


    this.load.image('pew','pew.png');

    var u;
    for(var i = 0; i <15; i++)
    {
        u = (i + 1).toString().padStart(4,'0');
        
    this.load.image('boom' + i, 'effects/explosion4/k2_' + u + '.png');
    }

    // load music
    this.load.audio('menu','music/Menu.wav');
    this.load.audio('battle','music/n-Dimensions (Main Theme).mp3');
    this.load.audio('sneak', 'music/Brought to life.mp3');
    this.load.audio('boss','music/Power Trip 3.mp3');

    // load SFX
    this.load.audio('shoot1','sounds/alienshoot1.wav');
    this.load.audio('shoot2','sounds/alienshoot2.wav');

}

function resumeGame()
{
    gameState = state.Gameplay; this.game.scene.scenes[0].physics.resume();this.game.sound.pauseAll(); battleMusic.resume();
     menuBack.visible = false; pauseText.visible = false; pauseShade.visible = false; gameLogo.visible = false; helpText.visible = true;
}

function pauseGame()
{
    gameState = state.Menu;this.game.scene.scenes[0].physics.pause(); this.game.sound.pauseAll();  pauseText.visible = true; pauseShade.visible = true;
}

function create ()
{
    background = this.add.tileSprite(500,500,1024,1024,'back');
    
   
    


 
    // Create music objects
    menuMusic = this.sound.add('menu', {loop: true});

    battleMusic = this.sound.add('battle', {loop: true});
    battleMusic.volume = 0.1;

    sneakMusic = this.sound.add('sneak', {loop: true});
    sneakMusic.volume = 0.1;

    bossMusic = this.sound.add('boss', {loop: true});
    bossMusic.volume = 0.1;

    var f = [];
    for( var i = 0; i < 15; i++)
    {
        f[i] = {key: 'boom' + i};
    }
    this.anims.create({key: 'explode', frames:f, frameRate: 30, repeat: 0});

   

   
    player = new Ship(this,'player',460,840, false);
    
    Ship.playerShip = player;

    for(let i = 0;i <4;i++)
    {

        enemy[i] = new Ship(this,'enemy' + (i+1),300, i*130+80,true);

        

       // Collide with the player
       this.physics.add.collider(player.sprite, enemy[i].sprite, function(hitShip, hitBullet, body1, body2) { /* TODO: Add collision code */});
        
    }

    // Collide with other enemies
    for(let i = 0;i < enemy.length;i++)
    {
        for(let j = i;j < enemy.length;j++)
        {
            this.physics.add.collider(enemy[i].sprite, enemy[j].sprite, function(hitShip, hitBullet, body1, body2) { console.log('one bounce');});
        }
    }

    // Add collision detection for Enemy bullets vs player
    for(let i = 0;i < enemy.length;i++)
    {

        for(let j = 0;j < enemy[i].bullet.length;j++)
        {
        this.physics.add.overlap(player.sprite, enemy[i].bullet[j], function(hitShip, hitBullet, body1, body2) { 
        console.log('Player hit'); 
        hitShip.hp -= 50;
        hitBullet.x = -400; hitBullet.y = -400; 
        hitShip.setVelocity(hitBullet.body.velocity.x*10,hitBullet.body.velocity.y*10); 
        hitBullet.setVelocity(0,0);}); 
        }

    }

    // Finally, add collision detection for Player bullets vs enemies
    for(let i = 0;i < enemy.length;i++)
    {

        for(let j = 0;j < player.bullet.length;j++)
        {
            this.physics.add.overlap(enemy[i].sprite, player.bullet[j], function(hitShip, hitBullet, body1, body2) { 
                console.log('Enemy hit'); 
                hitShip.hp -= 50;
                hitBullet.x = -400; hitBullet.y = -400; 
                hitShip.setVelocity(hitBullet.body.velocity.x*10,hitBullet.body.velocity.y*10); 
                hitBullet.setVelocity(0,0);}); 
        }
    }


    // The pause menu
    menuBack = this.add.tileSprite(500,500,1024,1024,'menuBack');
    pauseShade = this.add.rectangle(0, 0, 2000, 2000, 0x336633, .25);
    pauseShade.visible = false;

    gameLogo = this.add.sprite(500,350,'logo');
    gameLogo.setScale(0.5);

    keys = this.input.keyboard.addKeys('W,S,A,D,F,E,Q,UP,DOWN,SPACE,F1');
    infoText = this.add.text(10,30,"");
    helpText = this.add.text(10,10,"Press F1 to toggle help");
    helpText.visible = false; // Don't show the help text in the menu.
    pauseText = this.add.text(400,400, "Paused - Press escape to unpause");
    


   

    // Toggle the help for controls and debug. Also control music
    this.input.keyboard.on('keyup-F1',function(event) {infoText.visible = !infoText.visible;})
    this.input.keyboard.on('keyup-ONE',function(event) { if(!menuMusic.isPlaying) { this.game.sound.stopAll(); menuMusic.play();}})
    this.input.keyboard.on('keyup-TWO',function(event) { if(!battleMusic.isPlaying) { this.game.sound.stopAll(); battleMusic.play();}})
    this.input.keyboard.on('keyup-THREE',function(event) { if(!sneakMusic.isPlaying) { this.game.sound.stopAll(); sneakMusic.play();}})
    this.input.keyboard.on('keyup-FOUR',function(event) { if(!bossMusic.isPlaying) { this.game.sound.stopAll(); bossMusic.play();}})
    this.input.keyboard.on('keyup-ESC',function(event) { 
        
        if(gameState == state.Gameplay)
        {
         pauseGame(); return;
        }


        if(gameState == state.Menu)
        {

         resumeGame(); return;
        }
    
    });

   
    
    // Start game
    gameState = state.Menu;
    
    menuMusic.play();
    menuMusic.pause();

    battleMusic.play();
    battleMusic.pause();

    
    

    

    

   
}



function update ()
{
   // Cheesy scrolling background
   menuBack.tilePositionY -= 1;


 

    if(gameState == state.Gameplay)
    {
   
        // Basic controls, BIG thrust is the engine that player directly controls, LITTLE thrust is for indirectly controlled to prevent drift.
        if(keys.D.isDown) {player.right();}
        if(keys.A.isDown) {player.left();}

        if(keys.W.isDown) {player.forward();}
        if(keys.S.isDown) {player.back();}
        
        if(game.input.mousePointer.buttons == 1) { player.shoot();}

        // boom controls

        
        //if(keys.SPACE.isDown) {explosion.play('explode');}

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

}