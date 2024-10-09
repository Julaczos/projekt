class Overworld {
  constructor (config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d")
  }


  init() {
    const image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image,0,0)
    };
    image.src = "/projekt/images/DemoLower.png";

    const x = 0;
    const y = 0;
    const hero = new Image();
    hero.onload = () => {
        this.ctx.drawImage(hero, 0, 0, 16, 32, x, y, 16, 32)
      }
    hero.src = "/projekt/images/hero.png";
  }
}
