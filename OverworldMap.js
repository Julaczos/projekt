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
    lowerSrc: "/projekt/images/testowa.png",
    upperSrc: "/projekt/images/KitchenUpper.png",
    gameObjects: {
      hero: new GameObject({
        x: utils.withGrid(10),
        y: utils.withGrid(6),
      }),
      npc1: new GameObject({
        x: utils.withGrid(8),
        y: utils.withGrid(9),
        src: "/projekt/images/npc2.png"
      })
    }
  },
}
