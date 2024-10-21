class PlayerState {
  constructor() {
    this.pizzas = {
      "p1": {
        pizzaId: "s001",
        hp: 50,
        maxHp: 50,
        xp: 90,
        maxXp: 100,
        level: 1,
      }
    }
    this.lineup = ["p1"];
    this.items = [
      { actionId: "item_recoverHp", instanceId: "item1" },
      { actionId: "item_recoverHp", instanceId: "item2" },
      { actionId: "item_recoverHp", instanceId: "item3" },
    ]
    this.squatCount = 0; 
    this.bicepCurlCount = 0; 
  }

  gainXP(amount) {
    this.pizzas.p1.xp += amount;
    if (this.pizzas.p1.xp >= this.pizzas.p1.maxXp) {
      this.levelUp();
    }
  }

  levelUp() {
    this.pizzas.p1.level++;
    this.pizzas.p1.xp -= this.pizzas.p1.maxXp;
    this.pizzas.p1.maxXp = Math.floor(this.pizzas.p1.maxXp * 1.5);
  }
}
window.playerState = new PlayerState();
