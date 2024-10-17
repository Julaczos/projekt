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
    this.items = [
      { actionId: "item_recoverHp", instanceId: "item1" },
      { actionId: "item_recoverHp", instanceId: "item2" },
      { actionId: "item_recoverHp", instanceId: "item3" },
    ]
  }
}
window.playerState = new PlayerState();
window.playerStats = window.playerState.playerStats;
