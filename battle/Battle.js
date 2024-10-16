class Battle {
  constructor() {
    this.combatants = {
      "player1": new Combatant({
        team: "player",
        hp: window.playerStats.hp,
        maxHp: window.playerStats.maxHp,
        xp: window.playerStats.xp,
        maxXp: window.playerStats.maxXp,
        level: window.playerStats.level,
        status: window.playerStats.status,
      }, this),
      
      "enemy1": new Combatant({
        team: "enemy",
        hp: 20,
        maxHp: 50,
        xp: 20,
        maxXp: 100,
        level: 1,
      }, this),
      
      "enemy2": new Combatant({
        team: "enemy",
        hp: 25,
        maxHp: 50,
        xp: 30,
        maxXp: 100,
        level: 1,
      }, this),
    };

    this.activeCombatants = {
      player: "player1",
      enemy: "enemy1",  
    };
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");

    this.element.innerHTML = (`
      <div class="Battle_hero">
        <img src="${'/projekt/images/hero.png'}" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src=${'/projekt/images/npc3.png'} alt="Enemy" />
      </div>
    `);
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);
    });
  }
}
