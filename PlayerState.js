class PlayerState {
  constructor() {
    this.pizzas = {
      "p1": {
        pizzaId: "s001",
        hp: 50,
        maxHp: 50,
        xp: 0,
        maxXp: 100,
        level: 1,
        agility: 3,
        strength: 2,
        defense: 3,
      }
    }
    this.lineup = ["p1"];
    this.items = [
      { actionId: "item_recoverHp", instanceId: "item1" },
      { actionId: "item_recoverHp", instanceId: "item2" },
      { actionId: "item_recoverHp", instanceId: "item3" },
    ];
    this.squatCount = 0; 
    this.bicepCurlCount = 0; 
    this.storyFlags = {
      "Five_Squats": true,
    };
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

  addItem(itemId) {
    const newItem = { actionId: itemId, instanceId: `item${this.items.length + 1}` };
    this.items.push(newItem);
    console.log(`Dodano przedmiot: ${itemId}`);
  }
}
window.playerState = new PlayerState();
