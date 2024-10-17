class Battle {
  constructor({ enemy, onComplete }) {
    this.enemy = enemy;
    this.onComplete = onComplete;

    this.combatants = {};

    this.activeCombatants = {
      player: null,
      enemy: null,
    };

    this.addCombatant("player", "player", window.playerStats);

    this.addCombatant("enemy", "enemy", this.enemy);

    this.items = [];

    window.playerState.items.forEach(item => {
      this.items.push({
        ...item,
        team: "player"
      });
    });

    this.usedInstanceIds = {};
  }

addCombatant(id, team, config) {
  if (!config || !config.name || !config.hp || !config.maxHp || !config.level) {
    console.error("Invalid config object passed to addCombatant:", config);
    return;
  }

  this.combatants[id] = new Combatant({
    name: config.name,
    hp: config.hp,
    maxHp: config.maxHp,
    level: config.level,
    team,
    isPlayerControlled: team === "player"
  }, this);

  this.activeCombatants[team] = id;
}


  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
      <div class="Battle_hero">
        <img src="${'projekt/images/hero.png'}" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src="${this.enemy.src}" alt="${this.enemy.name}" />
      </div>
    `);
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", window.playerStats.name);
    this.enemyTeam = new Team("enemy", this.enemy.name);

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
      onWinner: winner => {
        if (winner === "player") {
          const playerState = window.playerState;
          playerState.hp = this.combatants["player"].hp;

          window.playerStats.hp = playerState.hp;
          window.playerStats.level = this.combatants["player"].level;
        }

        this.element.remove();
        this.onComplete();
      }
    });
    this.turnCycle.init();
  }
}
