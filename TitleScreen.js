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
    const modal = document.createElement("div");
    modal.classList.add("credits-modal");

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">Powrót</span>
            <h2>Twórcy</h2>
            <p>Wszyscy twórcy projektu GymAI:</p>
            <ul>
                <li>Twórca 1</li>
                <li>Twórca 2</li>
                <li>Twórca 3</li>
                <li>Twórca 4</li>
            </ul>
        </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
        modal.remove(); 
    });
}


  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = `
      <h1 class="TitleScreen_text">GymAI</h1>
    `;
  }

  close() {
    if (this.keyboardMenu) {
      this.keyboardMenu.end();
    }
    this.element.remove();
  }

  init(container) {
    this.container = container;
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    });
  }
}
