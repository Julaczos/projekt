class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0)
  }

  drawUpperImage(ctx) {
    ctx.drawImage(this.upperImage, 0, 0)
  } 
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/projekt/images/DemoLower.png",
    upperSrc: "/projekt/images/DemoUpper.png",
    gameObjects: {
      hero: new GameObject({
        x: 5,
        y: 6,
      }),
      npc1: new GameObject({
        x: 7,
        y: 9,
        src: "/projekt/images/npc1.png"
      })
    }
  },
  Kitchen: {
    lowerSrc: "/projekt/images/KitchenLower.png",
    upperSrc: "/projekt/images/KitchenUpper.png",
    gameObjects: {
      hero: new GameObject({
        x: 10,
        y: 3,
      }),
      npc1: new GameObject({
        x: 8,
        y: 12,
        src: "/projekt/images/npc2.png"
      })
    }
  },
}
