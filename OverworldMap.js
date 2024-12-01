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
    this.isPaused = false;
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
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        break;
      }
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

      const relevantScenario = match.talking.find(scenario => {
          return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })      
      })

      relevantScenario && this.startCutscene(relevantScenario.events)
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
  Store: {
    id: "Store",
    lowerSrc: "/projekt/images/StoreLower.png",
    upperSrc: "/projekt/images/StoreUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(13),
      }), 
      dietetyk: new Person ({
        x: utils.withGrid(9),
        y: utils.withGrid(5),
        src: "/projekt/images/dietetyk.png",
        talking: [
          {
            required: ["TALKED_TO_MARCIN"],
            events: [
              { type: "textMessage", text: "Trener przekazał mi, że przyjdziesz, miło cię widzieć, jak idzie ci walka z klątwą?", faceHero: "dietetyk" },
              { type: "textMessage", text: "Czuję, że brakuje mi energii. Może to przez to, co jem..."},
              { type: "textMessage", text: "Na pewno. Co zazwyczaj jesz na co dzień?"},
              { type: "textMessage", text: "Zwykle kawa i coś szybkiego. Niezbyt zdrowo..."},
              { type: "textMessage", text: "To jest problem. Zacznij od śniadania z pełnym białkiem i zbożami. Stabilna energia na cały dzień"},
              { type: "textMessage", text: "Brzmi dobrze, ale jak znaleźć na to czas?"},
              { type: "textMessage", text: "Nie musi być skomplikowane. Owsianka, jajka, orzechy. Szybkie, a zdrowe"},
              { type: "textMessage", text: "Czyli mogę przekąszać, byle zdrowo?"},
              { type: "textMessage", text: "Dokładnie. Wybieraj mądrze, a łatwiej pokonasz pokusy"},
              { type: "textMessage", text: "Dzięki! Zaczynam od dziś"},
              { type: "textMessage", text: "Super. Pamiętaj o nawodnieniu, po więcej szczegółów wejdź na ..."},
              { type: "textMessage", text: "A, i jeszcze jedno - mentor ma dla ciebie misję, powodzenia!"},
              { type: "addStoryFlag", flag: "TALKED_TO_ZELKA"},

           //   { type: "addItem", itemId: "item_recoverHp" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "Dzień dobry, życzę miłego dnia!", faceHero: "dietetyk" },
            ]
          },
        ]
      })
  },
  cutsceneSpaces: {
      [utils.asGridCoord(7,15)]: [
        {
          events: [
            { type: "changeMap", map: "MainMap", x: utils.withGrid(71), y: utils.withGrid(72), direction: "down"}
          ]
        }
      ]
  },
walls: function() {
    let walls = {};
    [
      "0,1", "1,1", "2,1", "3,1", "4,1", "5,1", "6,1", "7,1", "8,1", "9,1", "10,1", "11,1", "12,1", "13,1", "14,1",
      "1,4", "1,3", "2,2", "2,3", "2,4", "2,5", "2,6", "2,7", "2,10", "2,11", "2,12", 
      "3,5", "3,6", "3,7", "3,10", "3,11", "3,12", 
      "6,14", "8,14", "6,11", "6,10", "6,9", "6,7", "6,6", "6,5", "6,3", "6,2",
      "7,11", "7,10", "7,9", "7,7", "7,6", "7,5", "7,3", "7,2",
      "8,2", "8,3", "9,2", "9,3", "10,2", "10,3", "11,2", "11,3", "12,2", "12,3", "13,2", "13,3",
      "10,5", "10,6", "10,7", "10,10", "10,11", "10,12", "11,5", "11,6", "11,7", "11,10", "11,11", "11,12",
      "13,7", "13,10", "13,13",
      "14,2", "14,3", "14,4", "14,5", "14,6", "14,7", "14,8", "14,9", "14,10", "14,11", "14,12", "14,13", "14,14", "14,15",
      "13,15", "12,15", "11,15", "10,15", "9,15", "8,15", "6,15", "5,15", "4,15", "3,15", "2,15", "1,15", "0,15",
      "0,14", "0,13", "0,12", "0,11", "0,10", "0,9", "0,8", "0,7", "0,6", "0,5", "0,4", "0,3", "0,2", "1,2"
    ].forEach(coord => {
        let [x, y] = coord.split(",");
        walls[utils.asGridCoord(x, y)] = true;
    });
    return walls;
}(),


  },

  Hospital: {
    id: "Hospital",
    lowerSrc: "/projekt/images/HospitalLower.png",
    upperSrc: "/projekt/images/HospitalUpper.png",
    gameObjects: {
        hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(4),
        y: utils.withGrid(12),
      }),
      lekarz: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(5),
        src: "/projekt/images/npc11.png",
        talking: [
          {
            required ["TALKED_TO_LEKARZ"],
            events: [
               {{ type: "textMessage", text: "Hej, przed chwilą dałem ci jabłka", faceHero: "lekarz" },}
            ]
          }
          {
            events: [
              { type: "textMessage", text: "Hej, potrzebujesz pomocy?", faceHero: "lekarz" },
              { type: "textMessage", text: "Przydałoby się"},
              { type: "textMessage", text: "Proszę, jako lekarz mogę dać Ci lecznice jabłka"}, 
              { type: "addStoryFlag", flag: "TALKED_TO_LEKARZ"},
              { type: "addItem", itemId: "item_recoverHp" },
              { type: "addItem", itemId: "item_recoverHp" },
              { type: "addItem", itemId: "item_recoverHp" },
            ]
          }
        ]
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(4,14)]: [
        {
          events: [
            { type: "changeMap", map: "MainMap", x: utils.withGrid(40), y: utils.withGrid(79), direction: "down" }
          ]
        }
      ]
  }
  },

  
  FitnessRoom: {
    id: "FitnessRoom",
    lowerSrc: "/projekt/images/FitnessRoom.png",
    upperSrc: "/projekt/images/FitnessRoomUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(10),
        y: utils.withGrid(14),
      }),
      trener: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(9),
        src: "/projekt/images/trener.png",
        talking: [
            {
              required: ["TALKED_TO_RUDA"],
              events: [
                {type: "textMessage", text: "Rozmawiałem z dziećmi na boisku i dowiedziałem się o mrocznym bycie...", faceHero: "trener" },
                { type: "textMessage", text: "Mam nadzieję, że zdajesz sobie sprawę z swojego przeznaczenia" },
                { type: "textMessage", text: "Cóż, zdążyłem się domyślić" },
                { type: "textMessage", text: "Pamiętaj, że nie tylko trening się liczy!" },
                { type: "textMessage", text: "Tak? Co innego?" },
                { type: "textMessage", text: "Odwiedź dietetyczkę Annę, opowie ci o wadze zdrowego odżywiania, zwykle jest w sklepie" },
                {type: "addStoryFlag", flag: "TALKED_TO_MARCIN"},
              ]},
            { 
              required: ["Five_Squats"],
              events: [
            { type: "textMessage", text: "Widzisz, to nie takie trudne", faceHero: "trener" },
            { type: "textMessage", text: "Co to ma wspólnego z problemem miasta?" },
            { type: "textMessage", text: "Słyszałeś kiedykolwiek o Klątwie Próżniactwa?" },
            { type: "textMessage", text: "Nie...?" },
            { type: "textMessage", text: "Serio? Pójdź do dzieci na stadione, to ich ulubiona opowieść" },
           ]}, 
           { 
            events: [
            { type: "textMessage", text: "Wreszcie, nawet nie wiesz ile na ciebie czekałem!", faceHero: "trener" },
            { type: "textMessage", text: "Nic z tego nie rozumiem" },
            { type: "textMessage", text: "Spokojnie, wkrótce wszystko stanie się jasne" },
            { type: "textMessage", text: "Jednak najpierw wykonaj 5 przysiadów, tak, ty, do kamerki" },
            { type: "textMessage", text: "Jakiej kamerki..." },
          ]},
        ]
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(11,16)]: [
        {
          events: [
            { type: "changeMap", map: "MainMap", x: utils.withGrid(59), y: utils.withGrid(70), direction: "down" }
          ]
        }
      ]
  }
  },
  HerosHouse: {
    id: "HerosHouse",
    lowerSrc: "/projekt/images/HerosHouseLower.png",
    upperSrc: "/projekt/images/HerosHouseUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(3),
        y: utils.withGrid(11),
      }),
      mentor: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(4),
        src: "/projekt/images/mentor.png",
        talking: [
          {
            required: ["TALKED_TO_ZELKA"],
            events: [
              { type: "textMessage", text: "Czas na twój pierwszy pojedynek", faceHero: "mentor" },
              { type: "textMessage", text: "Czujesz się gotowy?" },
              { type: "textMessage", text: "Sam nie wiem..." },
              { type: "textMessage", text: "Musisz sam zdecydować czy walczyć teraz, czy poćwiczyć" },
              { type: "textMessage", text: "W każdym razie Upiór Braku Motywacji siedzi na trybunach, opętał Roberta " },
              { type: "textMessage", text: "Jeśli uda ci się wygrać, wróc do mnie, jeśli nie - udaj się do lekarza by odzyskać siły" },

            ]             
          },
          {
            required: ["TALKED_TO_MENTOR"],
            events: [
              { type: "textMessage", text: "Powiesz chociaż jak sie nazywasz?", faceHero: "mentor" },
              { type: "textMessage", text: "Andrzej" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "Co robisz w moim domu?!", faceHero: "mentor" },
              { type: "textMessage", text: "Możesz zrobić więcej niż myślisz, synu"},
              { type: "textMessage", text: "O co ci w ogóle chodzi?"},
              { type: "textMessage", text: "Widzę, że na sercu leży ci przyszłość Sanoveris"},
              { type: "textMessage", text: "Udaj się do FitnessRoomu, porozmawiaj z trenerem Marcinem"},
              { type: "textMessage", text: "Dalej nie wyjaśniłeś o co chodzi"},
              { type: "textMessage", text: "Zrób jak mówię, a zrozumiesz"},
              {type: "addStoryFlag", flag: "TALKED_TO_MENTOR"}
            ]
          }
        ]
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(3,12)]: [
        {
          events: [
            { type: "changeMap", map: "MainMap", x: utils.withGrid(23), y: utils.withGrid(49), direction: "down"  }
          ]
        }
      ],
  }
  },
  PoliceStation: {
    id: "PoliceStation",
    lowerSrc: "/projekt/images/PoliceStationLower.png",
    upperSrc: "/projekt/images/PoliceStationUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(10),
      }),
      npc20: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(8),
        src: "/projekt/images/npc20.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Nawet nie wiesz jak uwielbiam pączki", faceHero: "npc20" },
            ]
          }
        ]
     }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,16)]: [
        {
          events: [
            { type: "changeMap", map: "MainMap", x: utils.withGrid(69), y: utils.withGrid(62), direction: "down"  }
          ]
        }
      ],
    }
  },
  Office: {
    id: "Office",
    lowerSrc: "/projekt/images/OfficeLower.png",
    upperSrc: "/projekt/images/OfficeUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(10),
      }),
      npc6: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(4),
        src: "/projekt/images/npc6.png",
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,16)]: [
        {
          events: [
            { type: "changeMap", map: "MainMap", x: utils.withGrid(38), y: utils.withGrid(22), direction: "down"  }
          ]

        }

      ]
    }
  },
  GenBuilding: {
    id: "GenBuilding",
    lowerSrc: "/projekt/images/GenBuildingLower.png",
    upperSrc: "/projekt/images/GenBuildingUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(10),
      }),
      npc6: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(4),
        src: "/projekt/images/npc6.png",
        talking: [
          {
            required: ["TALKED_TO_MENTOR"],
            events: [
              { type: "textMessage", text: "Poznałeś już tego dziwaka?", faceHero: "npc6" },
              { type: "textMessage", text: "Znasz go?" },
              { type: "textMessage", text: "Ta, co jakiś czas się pojawia i mówi o sile sportu, głupoty" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "Czaisz, że dzisiaj są moje urodziny?", faceHero: "npc6" },
              { type: "textMessage", text: "Cały dzień będę tylko jadł słodycze"},
            ]
          }
        ]
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(5,11)]: [
        {
          events: [
            { type: "changeMap", map: "MainMap", x: utils.withGrid(43), y: utils.withGrid(35), direction: "down"  }
          ]
        }
      ],
  }
  },
  MainMap: {
    id: "MainMap",
    lowerSrc: "/projekt/images/MainMapLower.png",
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
      child1: new Person({
        x: utils.withGrid(64),
        y: utils.withGrid(20),
        src: "/projekt/images/child1.png",
        talking: [
          {
            required: ["TALKED_TO_RUDA"],
            events: [
              {type: "textMessage", text: "Nie mam siły...", facehero: "child1"},
            ]
          },
          {
            required: ["Five_Squats"],
            events: [
              {type: "textMessage", text: "Ehh, jeśli masz jakąś sprawę, porozmawiaj z Rudą", facehero: "child1"},
            ]
          },
          {
            events: [
              {type: "textMessage", text: "Nic mi się nie chce", facehero: "child1"},
            ]
          }
        ]
      }),
      child2: new Person({
        x: utils.withGrid(63),
        y: utils.withGrid(20),
        src: "/projekt/images/child2.png",
        talking: [
          {
            required: ["TALKED_TO_RUDA"],
            events: [
              {type: "textMessage", text: "Straszna sprawa, co nie?", facehero: "child2"}
            ]
          },
          {
            events: [
              {type: "textMessage", text: "Pogadaj z Rudą, ma ci coś do powiedzenia", facehero: "child2"}
            ]     
          }
        ]
      }),
      child3: new Person({
        x: utils.withGrid(65),
        y: utils.withGrid(20),
        src: "/projekt/images/child3.png",
        talking: [
          {
            required: ["TALKED_TO_RUDA"],
            events: [
              {type: "textMessage", text: "Powodzenia w walce", facehero: "child3"}
            ]
          },
          {
            required: ["Five_Squats"],
            events: [
              {type: "textMessage", text: "Dlaczego nie bawicie się na boisku? Przecież to piękny dzień", facehero: "child3"},
              {type: "textMessage", text: "Chcielibyśmy... ale nie mamy siły. Jesteśmy... zmęczeni..."},
              {type: "textMessage", text: "To przez... Klątwę Próżniactwa"},
              {type: "textMessage", text: "Klątwa Próżniactwa? Co to za klątwa? "},
              {type: "textMessage", text: "Moja babcia mówiła, że to przez brak zdrowej diety i sportu"},
              {type: "textMessage", text: "Wiesz może, co można z tym zrobić?"},
              {type: "textMessage", text: "Ponoć sławny bohater przybędzie i pokona mroczny byt, który to wszystko spowodował"},
              {type: "textMessage", text: "Cóż, w takim razie czas zacząć treningi, do zobaczenia!"},
              {type: "addStoryFlag", flag: "TALKED_TO_RUDA"}
            ]
          },
          {
            events: [
              {type: "textMessage", text: "Turuturu"},
            ]
          }
        ]
      }),
      npc4: new Person({
        x: utils.withGrid(60),
        y: utils.withGrid(20),
        src: "/projekt/images/npc4.png",
        talking: [
        {
            required: ["WON_WITH_ROBERT"],
            events: [
              {type: "textMessage", text: "Dziękuje"},
            ]
        },
        {
          events: [
          {type: "battle", enemyId: "robert" },
          { type: "addStoryFlag", flag: "WON_WITH_ROBERT" }
        ]
        },
        ]
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
walls: function() {
    let walls = {};
    [ "28,29", "29,29", "30,29", "31,29", "32,29", "33,29", "34,29", "35,29", "36,29", "37,29", "38,29", "39,29", "40,29", "41,29", "42,29", "43,29", "44,29", "45,29", "46,29",
      "46,30", "46,31", "46,32", "46,33", "46,34", "45,34", "44,34", "43,34", "42,34", "41,34", "40,34", "39,34", "38,34", "37,34", "36,34", "35,34", "34,34", "33,34", "32,34",
      "31,34", "30,34", "29,34", "28,34", "28,33", "28,32", "28,31", "28,30",
      "26,36", "20,32", "18,41", "16,49", "19,49", "20,59", "30,64", "25,75", "34,76",
      "22,45", "21,45", "23,45", "24,45", "25,45", "26,45", "27,45", "28,45", "29,45", 
      "29,46", "29,47", "29,48", "29,49", "30,47", "30,48", "21,46", "21,47", "21,48", 
      "21,49", "22,49", "22,50", "22,51", "23,51", "24,51", "23,48", "24,49", "25,49", 
      "26,49", "27,49", "28,49", "29,49",
      "54,63", "55,63", "56,63", "57,63", "58,63", "59,63", "60,63", 
      "60,64", "60,65", "60,66", "60,67", "60,68", "60,69", 
      "54,64", "54,65", "54,66", "54,67", "54,68", "54,69",
      "55,69", "56,69", "57,69", "58,69",
      "68,66", "69,66", "70,66", "71,66", "72,66", "73,66", "74,66",
      "74,67", "74,68", "74,69", "74,70", "74,71", "74,72", 
      "73,72", "72,72", "71,71", "70,72", "69,72", "68,72",
      "68,71", "68,70", "68,69", "68,68", "68,67",
      "48,35", "51,35", "51,53", "51,46", "52,46", "53,46", "54,46", "54,47", "54,48", "53,48", "52,48", "51,48", "51,47",
      "54,53", "55,53", "56,53", "57,53", "58,53", "59,53", "60,53", "54,55", "55,55", "56,55", "57,55", "58,55", "59,55", "60,55","54,54", "60,54", 
      "39,75", "40,75", "41,75", "42,75", "43,75", "44,75", "45,75", "45,76", "45,77", "45,78", "44,78", "43,78", "42,78", "41,78", "40,78", "39,78", "39,77", "39,76",
      "62,51", "66,58", "67,58", "68,58", "69,58", "70,58", "71,58", "72,58", "72,59", "72,60", "72,61", "72,62", "71,62", "70,62", "69,61", "68,62", "67,62", "66,62", "66,61", "66,60", "66,59",
      "58,19", "59,19", "60,19", "61,19", "62,19", "63,19", "64,19", "65,19", "66,19", "67,19", "68,19", "69,19", "70,19", "72,21", "56,21",
      "58,43", "59,43", "60,43", "61,43", "61,44", "61,45", "60,45", "59,45", "58,45", "58,44",
      "60,38", "61,38", "62,38", "63,38", "63,39", "63,40", "62,40", "61,40", "60,40", "60,39", "68,41", "69,41", "70,41", "71,41", "71,42", "71,43", "70,43", "69,43", "68,43", "68,42",
      "70,46", "71,46", "72,46", "73,46", "73,47", "73,48", "72,48", "71,48", "70,48", "70,47",
      /*nowe*/ "30,80", "31,80", "32,80", "22,67", "23,67", "21,35", "22,35", "26,22", "27,22", 
      "32,18", "33,18", "34,18", "35,18", "36,18", "37,18", "38,18", "39,18", "40,18", "41,18", "42,18", "43,18", "32,19", "32,20", "32,21", "32,22", "33,22", "34,22", "35,22", "36,22", "37,22", 
      "38,21", "39,22", "40,22", "41,22", "42,22", "42,21", "42,20", "42,19", "43,20", "43,19",
      "34,41", "35,41", "37,49", "38,56", "65,81", "66,81", "80,76", "81,76", "77,62", "78,62", "79,62", "80,62", "78,52", "79,52", "76,40", "77,39", "78,28", "79,28",
      "49,43", "50,43", "51,20", "52,20", "66,51", 
      "54,24", "55,24", "56,24", "56,25", "56,26", "56,27", "56,28", "55,28", "54,28", "54,27", "54,26", "54,25", "72,24", "73,24", "74,24", "74,25", "74,26", "74,27", "74,28", "73,28", "72,28", "72,27", "72,26", "72,25"
    ].forEach(coord => {
        let [x, y] = coord.split(",");
        walls[utils.asGridCoord(x, y)] = true;
    });
    return walls;
}(),
    cutsceneSpaces: {
      [utils.asGridCoord(59,70)]: [
        {
          events: [
            { type: "changeMap", map: "FitnessRoom", x: utils.withGrid(11), y: utils.withGrid(15), direction: "up" },
          ]
        }
      ],
      [utils.asGridCoord(23,49)]: [
        {
          events: [
            { type: "changeMap", map: "HerosHouse", x: utils.withGrid(3), y: utils.withGrid(12), direction: "up"},
          ]
        }
      ],
      [utils.asGridCoord(43,35)]: [
        {
          events: [
            { type: "changeMap", map: "GenBuilding", x: utils.withGrid(5), y: utils.withGrid(10), direction: "up"},
          ]
        }
      ],
      [utils.asGridCoord(71,72)]: [
        {
          events: [
            { type: "changeMap", map: "Store", x: utils.withGrid(7), y: utils.withGrid(14), direction: "up"},
          ]
        }
      ],
      [utils.asGridCoord(40,79)]: [
        {
          events: [
            { type: "changeMap", map: "Hospital", x: utils.withGrid(4), y: utils.withGrid(14), direction: "up"},
          ]
        }
      ],
      [utils.asGridCoord(69,62)]: [
        {
          events: [
            { type: "changeMap", map: "PoliceStation", x: utils.withGrid(7), y: utils.withGrid(16), direction: "up"},
          ]
        }
      ],
      [utils.asGridCoord(38,22)]: [
        {
          events: [
            { type: "changeMap", map: "Office", x: utils.withGrid(7), y: utils.withGrid(16), direction: "up"},
          ]
        }
      ],
  }
}
}
