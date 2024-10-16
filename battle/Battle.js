class Battle {
  constructor({ onComplete }) {
    this.onComplete = onComplete;

    this.combatants = {
      player: {
        name: "Gracz",
        level: 1,
        xp: 0,
        maxXp: 100,
        hp: 100,
        maxHp: 100,
        strength: 10,
        defense: 5,
      },
      enemy: {
        name: "Przeciwnik",
        level: 1,
        hp: 50,
        maxHp: 50,
        strength: 8,
        defense: 3,
      },
    };

    this.isBattleOver = false; 
  }

  attack(attacker, defender) {
    const damage = Math.max(0, attacker.strength - defender.defense);
    defender.hp = Math.max(0, defender.hp - damage);

    console.log(`${attacker.name} zadaje ${damage} obrażeń ${defender.name}.`);
    console.log(`${defender.name} ma teraz ${defender.hp} HP.`);

    if (defender.hp <= 0) {
      console.log(`${defender.name} został pokonany!`);
      this.isBattleOver = true;
      this.endBattle(attacker, defender);
    }
  }

  takeTurn() {
    if (this.isBattleOver) return;

    this.attack(this.combatants.player, this.combatants.enemy);

    if (!this.isBattleOver) {
      this.attack(this.combatants.enemy, this.combatants.player);
    }

    if (this.combatants.player.hp <= 0) {
      console.log("Gracz został pokonany. Przegrana walka.");
      this.isBattleOver = true;
    }
  }

  endBattle(winner, loser) {
    if (winner === this.combatants.player) {
      console.log("Wygrałeś walkę!");
      const xpGain = loser.level * 20;
      this.combatants.player.xp += xpGain;
      console.log(`Zdobyłeś ${xpGain} XP.`);

      this.checkLevelUp();
    } else {
      console.log("Przeciwnik wygrał walkę.");
    }

    this.onComplete();
  }

  checkLevelUp() {
    const player = this.combatants.player;
    if (player.xp >= player.maxXp) {
      player.level++;
      player.xp = 0;
      player.maxXp *= 1.5;
      player.strength += 2;
      player.maxHp += 10;
      player.hp = player.maxHp;

      console.log(`Awans na poziom ${player.level}!`);
    }
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = `
      <div class="Battle_hero">
        <h3>${this.combatants.player.name}</h3>
        <p>HP: ${this.combatants.player.hp}/${this.combatants.player.maxHp}</p>
      </div>
      <div class="Battle_enemy">
        <h3>${this.combatants.enemy.name}</h3>
        <p>HP: ${this.combatants.enemy.hp}/${this.combatants.enemy.maxHp}</p>
      </div>
    `;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    const battleInterval = setInterval(() => {
      if (!this.isBattleOver) {
        this.takeTurn();
      } else {
        clearInterval(battleInterval); 
        this.element.remove(); 
      }
    }, 1000);
  }
}
