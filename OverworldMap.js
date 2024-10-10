class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5)-cameraPerson.x, utils.withGrid(6)-cameraPerson.y)
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage, utils.withGrid(10.5)-cameraPerson.x, utils.withGrid(6)-cameraPerson.y)
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
      npc1: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(9),
        src: "/projekt/images/npc2.png"
        
      }),
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(10),
        y: utils.withGrid(6),
      })
    }
  },
}
