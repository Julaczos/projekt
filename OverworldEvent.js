class OverworldEvent {
  constructor({ map, event}) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    })
    
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    })

    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)

  }

  textMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }
  
  async changeMap(resolve) {
    this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
      x: this.event.x,
      y: this.event.y,
      direction: this.event.direction,
    });
    updateLocation(this.event.map); 
    await checkLocationAndStartCamera();
    resolve();

  }
  
  battle(resolve) {    
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      onComplete: (didWin) => {
        resolve(didWin ? "WON_BATTLE" : "LOST_BATTLE");
      }
    })
    battle.init(document.querySelector(".game-container"));

  }

  addItem(resolve) {
    window.playerState.addItem(this.event.itemId);
    resolve();
  }

  addStoryFlag (resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  restoreHpToMax(resolve) {
    const player = window.playerState;
    player.lineup.forEach(pizzaId => {
      const pizza = player.pizzas[pizzaId];
      if (pizza) {
        pizza.hp = pizza.maxHp;
      }
    });
    console.log("HP zostało przywrócone do maksymalnego poziomu.");
    resolve();
  }



  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    menu.init(document.querySelector(".game-container"));
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}
