class Battle {
  constructor({ enemy, onComplete }) {
    this.enemy = enemy;
    this.onComplete = onComplete;
    this.isBattleOver = false;

    this.attacks = [
      {
        name: "Szybki Cios",
        damage: 5,
      },
      {
        name: "Silny Cios",
        damage: 10,
      },
      {
        name: "Specjalny Atak",
        damage: 15,
      },
    ];
  }

  attack(attacker, defender, attack) {
    const damage = Math.max(0, attack.damage);
    defender.hp = Math.max(0, defender.hp - damage);
    console.log(`${attacker.name} używa ${attack.name} i zadaje ${damage} obrażeń ${defender.name}.`);
    console.log(`${defender.name} ma teraz ${defender.hp} HP.`);
    
    if (defender.hp <= 0) {
      console.log(`${defender.name} został pokonany!`);
      this.isBattleOver = true;
      return this.endBattle(attacker, defender);
    }
  }

  takeTurn(selectedAttack) {
    if (this.isBattleOver) {
      console.log("Walka już się zakończyła.");
      return;
    }

    this.attack(window.playerState.playerStats, this.enemy, selectedAttack);

    if (!this.isBattleOver) {
      this.attack(this.enemy, window.playerState.playerStats, this.enemyAttack());
    }

    if (window.playerState.playerStats.hp <= 0) {
      console.log(`${window.playerState.playerStats.name} został pokonany. Przegrana walka!`);
      this.isBattleOver = true;
    }
  }

  enemyAttack() {
    const damage = 8;
    console.log(`${this.enemy.name} atakuje!`);
    return {
      name: "Atak Przeciwnika",
      damage: damage,
    };
  }

  endBattle(winner, loser) {
    if (winner === window.playerState.playerStats) {
      console.log("Gratulacje! Wygrałeś walkę!");
      const xpGain = loser.level * 20;
      window.playerState.playerStats.xp += xpGain;

      console.log(`Zdobyto ${xpGain} XP. Gracz ma teraz ${window.playerState.playerStats.xp}/${window.playerState.playerStats.maxXp} XP.`);
      this.checkLevelUp();
    } else {
      console.log("Niestety, przegrałeś walkę.");
    }

    // Pokaż przycisk "Zakończ walkę"
    this.showEndBattleButton();
  }

  checkLevelUp() {
    if (window.playerState.playerStats.xp >= window.playerState.playerStats.maxXp) {
      window.playerState.playerStats.level += 1;
      window.playerState.playerStats.xp = 0;
      window.playerState.playerStats.maxXp *= 1.5;
      window.playerState.playerStats.hp = window.playerState.playerStats.maxHp;

      console.log(`Awansowałeś na poziom ${window.playerState.playerStats.level}! Nowe statystyki: HP ${window.playerState.playerStats.maxHp}.`);
    }
  }

  showEndBattleButton() {
    const endButton = document.createElement("button");
    endButton.classList.add("end-battle-button");
    endButton.textContent = "Zakończ walkę";
    this.element.appendChild(endButton);

    endButton.addEventListener("click", () => {
      console.log ("klikam");
      this.onComplete();
    });
  }

  createElement() {
  this.element = document.createElement("div");
  this.element.classList.add("Battle");

  this.hpDisplay = document.createElement("div");
  this.hpDisplay.classList.add("hp-display");
  this.hpDisplay.innerHTML = `
    <h2>${window.playerState.playerStats.name} HP: ${window.playerState.playerStats.hp}/${window.playerState.playerStats.maxHp}</h2>
    <h2>${this.enemy.name} HP: ${this.enemy.hp}/${this.enemy.maxHp}</h2>
  `;

  const attackButtons = this.attacks.map(attack => `
    <button class="attack-button" data-attack="${attack.name}">${attack.name}</button>
  `).join("");

  this.element.innerHTML = `
    <div class="Battle_hero">
      <img src="${'/projekt/images/hero.png'}" alt="Hero" />
    </div>
    <div class="Battle_enemy">
      <img src="${'/projekt/images/npc3.png'}" alt="Enemy" />
    </div>
    <div class="battle-controls">
      ${attackButtons}
    </div>
  `;

  this.element.appendChild(this.hpDisplay);

  this.element.querySelectorAll('.attack-button').forEach(button => {
    button.addEventListener('click', (event) => {
      const selectedAttack = this.attacks.find(attack => attack.name === event.target.dataset.attack);
      this.takeTurn(selectedAttack);
      this.updateHpDisplay();
    });
  });

  const endBattleButton = document.createElement("button");
  endBattleButton.textContent = "Zakończ walkę";
  endBattleButton.classList.add("end-battle-button");

  endBattleButton.addEventListener("click", () => {
    console.log("Walka zakończona przez użytkownika.");
    this.isBattleOver = true;

    this.element.remove();

    if (this.onComplete) {
      this.onComplete();
    }
  });

  this.element.appendChild(endBattleButton);
}


  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.updateHpDisplay();
  }
}
