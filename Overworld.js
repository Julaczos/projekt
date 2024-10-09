class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
  this.map = null;
 }

 startGameLoop(){
  const step = () => {
   requestAnimationFrame(() => {
     step();
    })
  }
  step();
 }

 
 init() {
  this.map = new OverworldMap(window.OverworldMap.DemoRoom);
  this.startGameLoop();

  
 }
}
