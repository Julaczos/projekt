class PlayerState {
  constructor() {  
    this.storyFlags = {};
    this.playerStats = {
      name: "player",
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      level: 1,
      status: null,
    };
  }
}
window.playerState = new PlayerState();
