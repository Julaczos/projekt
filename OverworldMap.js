class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image(); 
    this.upperImage.src = config.upperSrc;
    
    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key];
      object.id = key;
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))  
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

function generateWalkingLoop(steps, direction) {
    const loop = [];
    for (let i = 0; i < steps; i++) {
        loop.push({ type: "walk", direction: direction });
    }
    return loop;
}

window.OverworldMaps = {
  FitnessRoom: {
    lowerSrc: "/projekt/images/FitnessRoom.png",
    upperSrc: "/projekt/images/FitnessRoomUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(10),
        y: utils.withGrid(14),
      }),
      npc1: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(9),
        src: "/projekt/images/npc1.png"
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(10,15)]: [
        {
          events: [
            { type: "changeMap", map: "MainMap" }
          ]
        }
      ]
  }
  },
  HerosHouse: {
    lowerSrc: "/projekt/images/HerosHouseLower.png",
    upperSrc: "/projekt/images/HerosHouseUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(3),
        y: utils.withGrid(11),
      }),
      npc1: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(4),
        src: "/projekt/images/mentor.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Co robisz w moim domu?!", faceHero: "npc1" },
              { type: "textMessage", text: "Możesz zrobić więcej niż myślisz, synu"},
              { type: "textMessage", text: "O co ci w ogóle chodzi?"},
              { type: "textMessage", text: "Widzę, że na sercu leży ci przyszłość Sanoveris"},
              { type: "textMessage", text: "Udaj się do FitnessRoomu, porozmawiaj z trenerem Marcinem"},
              { type: "textMessage", text: "Dalej nie wyjaśniłeś o co chodzi"},
              { type: "textMessage", text: "Zrób jak mówię, a zrozumiesz"},
            ]
          }
        ],
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(3,12)]: [
        {
          events: [
            { type: "changeMap", map: "MainMap" }
          ]
        }
      ],
  }
  },
  MainMap: {
    lowerSrc: "/projekt/images/MainMap.png",
    upperSrc: "/projekt/images/MainMapUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(23),
        y: utils.withGrid(50),
      }),
      npc1: new Person({
        x: utils.withGrid(28),
        y: utils.withGrid(36),
        src: "/projekt/images/npc1.png",
        behaviorLoop: [
          ...generateWalkingLoop(18, "right"),
          { type: "stand", direction: "down", time: 800},
          ...generateWalkingLoop(18, "left"),
          { type: "stand", direction: "up", time: 800},
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "I'm busy...", faceHero: "npc1" },
              { type: "textMessage", text: "Go away!"},
            ]
          }
        ],        
      }),
      npc2: new Person({
        x: utils.withGrid(55),
        y: utils.withGrid(56),
        src: "/projekt/images/npc2.png"
      }),
      npc3: new Person({
        x: utils.withGrid(58),
        y: utils.withGrid(45),
        src: "/projekt/images/npc3.png"
      }),
      npc4: new Person({
        x: utils.withGrid(60),
        y: utils.withGrid(19),
        src: "/projekt/images/npc4.png"
      }),
      npc5: new Person({
        x: utils.withGrid(50),
        y: utils.withGrid(88),
        src: "/projekt/images/npc5.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 800},
          { type: "stand", direction: "up", time: 1000},
          { type: "stand", direction: "right", time: 1200},
          { type: "stand", direction: "down", time: 500},
        ]
      })
    },
    walls: {
      [utils.asGridCoord(28,29)] : true, //poczatek domku nr 1
      [utils.asGridCoord(29,29)] : true,
      [utils.asGridCoord(30,29)] : true,
      [utils.asGridCoord(31,29)] : true,
      [utils.asGridCoord(32,29)] : true,
      [utils.asGridCoord(33,29)] : true,
      [utils.asGridCoord(34,29)] : true,
      [utils.asGridCoord(35,29)] : true,
      [utils.asGridCoord(36,29)] : true,
      [utils.asGridCoord(37,29)] : true,
      [utils.asGridCoord(38,29)] : true,
      [utils.asGridCoord(39,29)] : true,
      [utils.asGridCoord(40,29)] : true,
      [utils.asGridCoord(41,29)] : true,
      [utils.asGridCoord(42,29)] : true,
      [utils.asGridCoord(43,29)] : true,
      [utils.asGridCoord(44,29)] : true,
      [utils.asGridCoord(45,29)] : true,
      [utils.asGridCoord(46,29)] : true,
      [utils.asGridCoord(46,30)] : true,
      [utils.asGridCoord(46,31)] : true,
      [utils.asGridCoord(46,32)] : true,
      [utils.asGridCoord(46,33)] : true,
      [utils.asGridCoord(46,34)] : true,
      [utils.asGridCoord(45,34)] : true,
      [utils.asGridCoord(44,34)] : true,
      [utils.asGridCoord(43,34)] : true,
      [utils.asGridCoord(42,34)] : true,
      [utils.asGridCoord(41,34)] : true,
      [utils.asGridCoord(40,34)] : true,
      [utils.asGridCoord(39,34)] : true,
      [utils.asGridCoord(38,34)] : true,
      [utils.asGridCoord(37,34)] : true,
      [utils.asGridCoord(36,34)] : true,
      [utils.asGridCoord(35,34)] : true,
      [utils.asGridCoord(34,34)] : true,
      [utils.asGridCoord(33,34)] : true,
      [utils.asGridCoord(32,34)] : true,
      [utils.asGridCoord(31,34)] : true,
      [utils.asGridCoord(30,34)] : true,
      [utils.asGridCoord(29,34)] : true,
      [utils.asGridCoord(28,34)] : true,
      [utils.asGridCoord(28,33)] : true,
      [utils.asGridCoord(28,32)] : true,
      [utils.asGridCoord(28,31)] : true,
      [utils.asGridCoord(28,30)] : true, //koniec domku nr 1
      [utils.asGridCoord(26,36)] : true,
      [utils.asGridCoord(20,32)] : true,
      [utils.asGridCoord(18,41)] : true,
      [utils.asGridCoord(16,49)] : true,
      [utils.asGridCoord(19,49)] : true,
      [utils.asGridCoord(20,59)] : true,
      [utils.asGridCoord(30,64)] : true,
      [utils.asGridCoord(25,75)] : true,
      [utils.asGridCoord(34,76)] : true, // test1
      [utils.asGridCoord(22,45)] : true, //poczatek domku nr 2
      [utils.asGridCoord(21,45)] : true,
      [utils.asGridCoord(23,45)] : true,
      [utils.asGridCoord(24,45)] : true,
      [utils.asGridCoord(25,45)] : true,
      [utils.asGridCoord(26,45)] : true,
      [utils.asGridCoord(27,45)] : true,
      [utils.asGridCoord(28,45)] : true,
      [utils.asGridCoord(29,45)] : true,
      [utils.asGridCoord(29,46)] : true,
      [utils.asGridCoord(29,47)] : true,
      [utils.asGridCoord(29,48)] : true,
      [utils.asGridCoord(29,49)] : true, //
      [utils.asGridCoord(30,47)] : true,
      [utils.asGridCoord(30,48)] : true,
      [utils.asGridCoord(21,46)] : true,
      [utils.asGridCoord(21,47)] : true,
      [utils.asGridCoord(21,48)] : true,
      [utils.asGridCoord(21,49)] : true,
      [utils.asGridCoord(22,49)] : true,
      [utils.asGridCoord(22,50)] : true,
      [utils.asGridCoord(22,51)] : true,
      [utils.asGridCoord(23,51)] : true,
      [utils.asGridCoord(24,51)] : true,
      [utils.asGridCoord(23,48)] : true,
      [utils.asGridCoord(24,49)] : true,
      [utils.asGridCoord(25,49)] : true,
      [utils.asGridCoord(26,49)] : true,
      [utils.asGridCoord(27,49)] : true,
      [utils.asGridCoord(28,49)] : true,
      [utils.asGridCoord(29,49)] : true,     
      [utils.asGridCoord(54,63)] : true,     //poczatek fitness room
      [utils.asGridCoord(55,63)] : true,     
      [utils.asGridCoord(56,63)] : true,     
      [utils.asGridCoord(57,63)] : true,     
      [utils.asGridCoord(58,63)] : true,     
      [utils.asGridCoord(59,63)] : true,     
      [utils.asGridCoord(60,63)] : true, //sciana gorna    
      [utils.asGridCoord(60,64)] : true,     
      [utils.asGridCoord(60,65)] : true,     
      [utils.asGridCoord(60,66)] : true,     
      [utils.asGridCoord(60,67)] : true,     
      [utils.asGridCoord(60,68)] : true,     
      [utils.asGridCoord(60,69)] : true,   //prawo  
      [utils.asGridCoord(54,64)] : true,     
      [utils.asGridCoord(54,65)] : true,     
      [utils.asGridCoord(54,66)] : true,     
      [utils.asGridCoord(54,67)] : true,     
      [utils.asGridCoord(54,68)] : true,     
      [utils.asGridCoord(54,69)] : true,  //lewo   
      [utils.asGridCoord(55,69)] : true,     
      [utils.asGridCoord(58,69)] : true,     
      [utils.asGridCoord(57,69)] : true,     
      [utils.asGridCoord(56,69)] : true,    //dol 
      [utils.asGridCoord(68,66)] : true,    //poczatek market
      [utils.asGridCoord(69,66)] : true,     
      [utils.asGridCoord(70,66)] : true,     
      [utils.asGridCoord(71,66)] : true,     
      [utils.asGridCoord(72,66)] : true,     
      [utils.asGridCoord(73,66)] : true,     
      [utils.asGridCoord(74,66)] : true,     //gora marketu
      [utils.asGridCoord(74,67)] : true,     
      [utils.asGridCoord(74,68)] : true,     
      [utils.asGridCoord(74,69)] : true,     
      [utils.asGridCoord(74,70)] : true,     
      [utils.asGridCoord(74,71)] : true,     
      [utils.asGridCoord(74,72)] : true,     
      [utils.asGridCoord(73,72)] : true,     
      [utils.asGridCoord(72,72)] : true,  //dol
      [utils.asGridCoord(71,71)] : true,  
      [utils.asGridCoord(70,72)] : true,  
      [utils.asGridCoord(69,72)] : true,  
      [utils.asGridCoord(68,72)] : true,  
      [utils.asGridCoord(68,71)] : true,  
      [utils.asGridCoord(68,70)] : true,  
      [utils.asGridCoord(68,69)] : true,  
      [utils.asGridCoord(68,68)] : true,  
      [utils.asGridCoord(68,67)] : true,  
   /*    [utils.asGridCoord(72,72)] : true,  
      [utils.asGridCoord(72,72)] : true,  
      [utils.asGridCoord(72,72)] : true,  
      [utils.asGridCoord(72,72)] : true,  
      [utils.asGridCoord(72,72)] : true,  
      [utils.asGridCoord(72,72)] : true,  
      [utils.asGridCoord(72,72)] : true,  
      [utils.asGridCoord(72,72)] : true,  */
    },
    cutsceneSpaces: {
      [utils.asGridCoord(59,70)]: [
        {
          events: [
            { type: "changeMap", map: "FitnessRoom" },
          ]
        }
      ],
      [utils.asGridCoord(23,49)]: [
        {
          events: [
            { type: "changeMap", map: "HerosHouse" },
          ]
        }
      ]
  }
}
}
