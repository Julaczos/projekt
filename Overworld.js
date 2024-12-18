class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
   this.map = null;
 }

  startGameLoop() {  
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const cameraPerson = this.map.gameObjects.hero;

      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      this.map.drawLowerImage(this.ctx, cameraPerson);

      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      })

      this.map.drawUpperImage(this.ctx, cameraPerson);

      if (!this.map.isPaused) {
       requestAnimationFrame(() => {
         step();   
       })
    }}
    step();
 }

 bindActionInput() {
   new KeyPressListener("Enter", () => {
     this.map.checkForActionCutscene()
   })
   new KeyPressListener("Escape", () => {
     if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { type: "pause" }
      ])
     }
   })
 }

 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId === "hero") {
       this.map.checkForFootstepCutscene()
     }
   })
 }

 startMap(mapConfig, heroInitialState=null) {
  this.map = new OverworldMap(mapConfig);
  this.map.overworld = this;
  this.map.mountObjects();

  if (heroInitialState) {
    const {hero} = this.map.gameObjects;
    this.map.removeWall(hero.x, hero.y);
    hero.x = heroInitialState.x;
    hero.y = heroInitialState.y;
    hero.direction = heroInitialState.direction;
    this.map.addWall(hero.x, hero.y);
  }
  this.progress.mapId = mapConfig.id;
  this.progress.startingHeroX = this.map.gameObjects.hero.x;
  this.progress.startingHeroY = this.map.gameObjects.hero.y;
  this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
 }
 
 async init() {

  const container = document.querySelector(".game-container");

  this.progress = new Progress();

  this.titleScreen = new TitleScreen({
    progress: this.progress
  })
  const useSaveFile = await this.titleScreen.init(container);

  let czy = false;
  let initialHeroState = null;
  if (useSaveFile) {
    czy = true;
    this.progress.load();
    initialHeroState = {
      x: this.progress.startingHeroX,
      y: this.progress.startingHeroY,
      direction: this.progress.startingHeroDirection,
    }
  }

  this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState );

  this.bindActionInput();
  this.bindHeroPositionCheck();

  this.directionInput = new DirectionInput();
  this.directionInput.init();

  this.startGameLoop();

   if (czy === false) {
      this.map.startCutscene([
     //   { type: "battle", enemyId: "tomasz"},
       { type: "textMessage", text: "Miasto było kiedyś takie żywe..."},
       { type: "textMessage", text: "Teraz wygląda jakby umierało. Co się tutaj stało?"},
       { type: "textMessage", text: "Lepiej wrócę do domu"},
     ])
   }

 }
}
