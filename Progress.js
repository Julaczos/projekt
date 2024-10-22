class Progress {
  constructor () {
    this.mapId = "MainMap";
    this.startingHeroX = 23;
    this.startingHeroY = 49;
    this.startingHeroDirection = "down";
    this.saveFileKey = "GymAI_SaveFile1";
  }

  save() {
    if (this.mapId != "FitnessRoom")
        {
          window.localStorage.setItem(this.saveFileKey, JSON.stringify({
            mapId: this.mapId,
            startingHeroX: this.startingHeroX,
            startingHeroY: this.startingHeroY,
            startingHeroDirection: this.startingHeroDirection,
            playerState: {
              storyFlags: playerState.storyFlags,
              pizzas: playerState.pizzas,
              lineup: playerState.lineup,
              items: playerState.items,
              squatCount: playerState.squatCount,
              bicepCurlCount: playerState.bicepCurlCount
            }
          }))      
        }
    else 
    {
      alert ("Nie możesz zapisywac w FitnessRoom!");
    }

  }

  getSaveFile() {
    const file = window.localStorage.getItem(this.saveFileKey);
    return file ? JSON.parse(file) : null
  }
  
  load() {
    const file = this.getSaveFile();
    if (file) {
      this.mapId = file.mapId;
      this.startingHeroX = file.startingHeroX;
      this.startingHeroY = file.startingHeroY;
      this.startingHeroDirection = file.startingHeroDirection;
      Object.keys(file.playerState).forEach(key => {
        playerState[key] = file.playerState[key];
      })
    }
  }

}
