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
      
      requestAnimationFrame(() => {
        step();   
      })
    }
    step();
 }

 bindActionInput() {
   new KeyPressListener("Enter", () => {
     this.map.checkForActionCutscene()
   })
 }

 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId === "hero") {
       this.map.checkForFootstepCutscene()
     }
   })
 }

 startMap(mapConfig) {
  this.map = new OverworldMap(mapConfig);
  this.map.overworld = this;
  this.map.mountObjects();
 }

 init() {
  this.startMap(window.OverworldMaps.MainMap);

  this.titleScreen = new TitleScreen({
    progress: this.progress
  })
  const useSaveFile = await this.titleScreen.init(container);

  this.bindActionInput();
  this.bindHeroPositionCheck();

  this.directionInput = new DirectionInput();
  this.directionInput.init();

  this.startGameLoop();


   this.map.startCutscene([
     { type: "textMessage", text: "Miasto było kiedyś takie żywe..."},
     { type: "textMessage", text: "Teraz wygląda jakby umierało. Co się tutaj stało?"},
     { type: "textMessage", text: "Lepiej wrócę do domu"},
    
   ])

 }
}
