class Ship
{
    static BIG_THRUST = 1000;
    static LITTLE_THRUST = 5.0; 
    static playerShip;
constructor(engine,spriteName,x,y,enemy)
{
    this.sprite = engine.physics.add.sprite(x,y, spriteName);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.setScale(0.5);

    this.enemy = enemy;
    if(enemy) {
        this.sprite.angle = 180;
        
    }

    this.tX = 0.0;
    this.tY = 0.0;

    this.spaceInvaderRight = true;
}

left()
{
    this.tX = -Ship.BIG_THRUST;
}
right()
{
    this.tX = Ship.BIG_THRUST;
}
forward()
{
    this.tY = -Ship.BIG_THRUST;
}
back()
{
    this.tY = Ship.BIG_THRUST;
}
update()
{

    if(this.enemy) {this.doAI();}
    
    // If we aren't using the big thruster, activate the little thruster to slow us down and prevent drift.... if our X velocity is really small, just 
    // "apply the handbrake", setting velocity to zero
    if(this.tX == 0)
    {
        if(Math.abs(this.sprite.body.velocity.x) > 10)
        {
            this.tX = this.sprite.body.velocity.x * -Ship.LITTLE_THRUST; 
            
        }
        else
        {
            this.sprite.setVelocityX(0);
            
        }
        
    }
    // Same as above, but for Y axis, not sure if I should make this into a function.
    if(this.tY == 0)
    {
        if(Math.abs(this.sprite.body.velocity.y) > 1)
        {
            this.tY = this.sprite.body.velocity.y * -Ship.LITTLE_THRUST; 
        }
        else
        {
            this.sprite.setVelocityY(0);
        }
    
    }
     

/// Speed cap
   if(this.sprite.body.velocity.x > 400) {this.sprite.setVelocityX(400);this.tX = 0;}
   if(this.sprite.body.velocity.x < -400) {this.sprite.setVelocityX(-400);this.tX = 0;}

    // Activate big thruster!
    this.sprite.setAcceleration(this.tX,this.tY);

    this.tX = 0;
    this.tY = 0;
}
doAI() 
{

    if(this.sprite.x > 750) {this.spaceInvaderRight = false; }
    if(this.sprite.x < 150) {this.spaceInvaderRight = true; }

    if(this.spaceInvaderRight) {this.right();} else {this.left();}


    this.sprite.angle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, Ship.playerShip.sprite.x, Ship.playerShip.sprite.y)
       ) + 90; // The +90 is to ensure it points forward rather than to the right.

}

}