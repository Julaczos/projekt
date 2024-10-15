class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
  }

  getOptions(resolve) {
    const safeFile = this.progress.getSaveFile();
    return [
      { 
        label: "Nowa Gra",
        description: "Rozpocznij nową przygodę",
        handler: () => {
          this.close();
          resolve();
        }
      },
      safeFile ? {
        label: "Kontynuuj Grę",
        description: "Wczytaj stan gry",
        handler: () => {
          this.close();
          resolve(safeFile);
        }
      } : null,
    {
      label: "Twórcy",
      description: "Poznaj twórców gry",
      handler: () => {
        this.showCredits();
      }
    }
    ].filter(v => v);
  }

  showCredits() {
    const creditsElement = document.createElement("div");
    creditsElement.classList.add("creditsOverlay");
    creditsElement.innerHTML = `
      <h2>Twórcy Gry</h2>
      <p>Programista: Julia Szerszeń</p>
      <p>Pomysłodawca: Patryk Brandys</p>
      <p>Assety: https://limezu.itch.io</p>
      <button id="closeCredits">Zamknij</button>
    `;

    document.body.appendChild(creditsElement);
    document.getElementById("closeCredits").addEventListener("click", () => {
      creditsElement.remove(); 
    });
  }

  
createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = (`
      <h1 class="TitleScreen_text">GymAI</h1>
    `);
}


  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }
  
  init(container) {
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve))
    })
  }

}
