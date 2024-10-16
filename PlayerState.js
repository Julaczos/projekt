class PlayerState {
  constructor() {  
    this.storyFlags = {
      //Five_Squats: true
    };
  }
}
window.playerState = new PlayerState();

window.playerStats = {
  hp: 50,
  maxHp: 50,
  xp: 0,
  maxXp: 100,
  level: 1,
  status: null,
};

