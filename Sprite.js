class Sprite {
  constructor (config){

    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }
    
    this.animations = config.animations || {
      "idle-down": [ [18,1], [19,1], [20,1], [21,1], [22,1], [23,1], ],
      "idle-up": [ [6,1], [7,1], [8,1], [9,1], [10,1], [11,1], ],
      "idle-left": [ [12,1], [13,1], [14,1], [15,1], [16,1], [17,1], ],
      "idle-right": [ [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], ],
      "walk-down": [ [18,2], [19,2], [20,2], [21,2], [22,2], [23,2], ],
      "walk-up": [ [6,2], [7,2], [8,2], [9,2], [10,2], [11,2], ],
      "walk-left": [ [12,2], [13,2], [14,2], [15,2], [16,2], [17,2], ],
      "walk-right": [ [0,2], [1,2], [2,2], [3,2], [4,2], [5,2], ]
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

  setAnimation (key){
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit
    }
  }

  updateAnimationProgress (){
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }


  draw (ctx, cameraPerson) {
    const x = this.gameObject.x + utils.withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(this.image,frameX*16,frameY*32,16,32,x,y,16,32)

    this.updateAnimationProgress();
  }
}
