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
  this.element.innerHTML = `
    <h2 class="credits-title">Twórcy Gry</h2>
    <p class="credits-text">Programista: Imię Programisty</p>
    <p class="credits-text">Grafik: Imię Grafika</p>
    <p class="credits-text">Muzyka: Imię Kompozytora</p>
    <button id="backToTitleScreen" class="credits-button">Powrót</button>
  `;

  document.getElementById("backToTitleScreen").addEventListener("click", () => {
    this.close();  
    this.init(container); 
  });
}

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = (`
      <h1 class="TitleScreen_text">GymAI</h1>
    `);

    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions(() => {
    }));
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }

  init(container) {
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    });
  }
}
