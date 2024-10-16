class Battle {
  constructor() {
    this.combatants = {
      "player1": new Combatant({
        ...Pizzas.s001,
        team: "player",
        hp: 30,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null
      }, this),
      "enemy1": new Combatant({
        ...Pizzas.v001,
        team: "enemy",
        hp: 20,
        maxHp: 50,
        xp: 20,
        maxXp: 100,
        level: 1,
      }, this),
      "enemy2": new Combatant({
        ...Pizzas.f001,
        team: "enemy",
        hp: 25,
        maxHp: 50,
        xp: 30,
        maxXp: 100,
        level: 1,
      }, this)
    }
    this.activeCombatants = {
      player: "player1",
      enemy: "enemy1",
    }
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
    <div class="Battle_hero">
      <img src="${'/projekt/images/hero.png'}" alt="Hero" />
    </div>
    <div class="Battle_enemy">
      <img src=${'/projekt/images/npc1.png'} alt="Enemy" />
    </div>
    `)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element)
    })

  }

}