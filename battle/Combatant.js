class Combatant {
    constructor(config, battle) {
      this.id = null;  
      this.team = config.team;  
      this.hp = config.hp;  
      this.maxHp = config.maxHp;  
      this.xp = config.xp;  
      this.maxXp = config.maxXp; 
      this.level = config.level;  
      this.status = config.status; 
      this.battle = battle;  

      this.hudElement = null;  
      this.characterElement = null;  
      this.healthBar = null;  
      this.xpBar = null; 
    }
  
    updateHealthBar() {
      const percent = (this.hp / this.maxHp) * 100;
      this.healthBar.style.width = `${percent}%`;
    }
  
    updateXpBar() {
      const percent = (this.xp / this.maxXp) * 100;
      this.xpBar.style.width = `${percent}%`;
    }
  
    init(container) {
      this.hudElement = document.createElement("div");
      this.hudElement.classList.add("Combatant_hud");
      
      this.hudElement.innerHTML = (`
        <p class="Combatant_name">${this.team === "player" ? "Gracz" : "Przeciwnik"}</p>
        <div class="Combatant_health-bar">
          <div class="inner-health"></div>
        </div>
        <div class="Combatant_xp-bar">
          <div class="inner-xp"></div>
        </div>
      `);
  
      container.appendChild(this.hudElement);
  
      this.healthBar = this.hudElement.querySelector(".inner-health");
      this.xpBar = this.hudElement.querySelector(".inner-xp");
  
      this.updateHealthBar();
      this.updateXpBar();
  
      this.characterElement = document.createElement("div");
      this.characterElement.classList.add("Combatant");
      this.characterElement.setAttribute("data-team", this.team);
  
      this.characterElement.innerHTML = (`
        <img src="${this.team === "player" ? '/projekt/images/hero.png' : '/projekt/images/npc3.png'}" alt="${this.team}" />
      `);
  
      container.appendChild(this.characterElement);
    }
  
    takeDamage(damage) {
      this.hp = Math.max(0, this.hp - damage);
      this.updateHealthBar();
      
      if (this.hp === 0) {
        this.faint(); 
      }
    }
  
    heal(amount) {
      this.hp = Math.min(this.maxHp, this.hp + amount);
      this.updateHealthBar();
    }
  
    gainXp(amount) {
      this.xp += amount;
      if (this.xp >= this.maxXp) {
        this.levelUp();
      }
      this.updateXpBar();
    }
  
    levelUp() {
      this.level += 1;
      this.xp = 0;  
      this.maxXp *= 1.5; 
    }
  
    faint() {
      console.log(`${this.team} stracił przytomność!`);
    }
  }
  