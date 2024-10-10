class Sprite {
  constructor (config){

    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }
    
    this.animations = config.animations || {
      idleDown: [
        [3,0]
      ]
    }
    this.currentAnimation = config.currentAnimation || "idleDown";
    this.currentAnimationFrame = 0;

    this.gameObject = config.gameObject;
  }


  draw (ctx) {
    const x = this.gameObject.x;
    const y = this.gameObject.y - 18;

    this.isLoaded && ctx.drawImage(this.image,0,0,16,32,x,y,16,32)
  }
}
