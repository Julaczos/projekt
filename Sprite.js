class Sprite {
  constructor (config){

    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }
    
    this.animations = config.animations || {
      "idle-down": [ [18,1], [19,1], [20,1], [21,1], [22,1], [23,1] ],
      "walk-down": [ [18,2], [19,2], [20,2], [21,2], [22,2], [23,2] ]
    }
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 16;
    this.animationFrameProgress = this.animationFrameLimit;
    
    
    this.gameObject = config.gameObject;
  }

  get frame () {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  updateAnimationProgress (){
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frmae === undefined) {
      this.currentAnimationFrame = 0;
    }
  }


  draw (ctx) {
    const x = this.gameObject.x;
    const y = this.gameObject.y - 18;

    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(this.image,frameX*16,frameY*32,16,32,x,y,16,32)

    this.updateAnimationProgress();
  }
}
