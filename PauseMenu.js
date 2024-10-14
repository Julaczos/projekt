class PauseMenu {
  constructor({ onComplete }) {
    this.onComplete = onComplete;
  }

  getOptions(pageKey) {
    if (pageKey === "root") {
      return [
        {
          label: "Zapisz",
          description: "Zapisz swój progres",
          handler: () => {
            // Tutaj można dodać kod do zapisywania
          }
        },
        {
          label: "Statystyki",
          description: "Zobacz statystyki",
          handler: () => {
            this.showStatistics();
          }
        },
        {
          label: "Zamknij",
          description: "Zamknij menu",
          handler: () => {
            this.close();
          }
        }
      ];
    }
    return [];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("PauseMenu");
    this.element.innerHTML = (`
      <h2>Pauza</h2>
    `);
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  showStatistics() {
    const statsElement = document.createElement("div");
    statsElement.classList.add("statsOverlay");
    statsElement.innerHTML = `
      <h3>Twoje Statystyki</h3>
      <p>Poziom: ${window.level}</p>
      <p>Doświadczenie: ${window.xp} / ${window.xpToNextLevel}</p>
      <p>Przysiady: ${window.squatCount}</p>
      <p>Biceps Curls: ${window.bicepCurlCount}</p>
      <button id="closeStats">Zamknij</button>
    `;

    document.body.appendChild(statsElement);

    document.getElementById("closeStats").addEventListener("click", () => {
      statsElement.remove();
    });
  }

  init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      // descriptionContainer: game-container
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));

    container.appendChild(this.element);
    
    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    });
  }
}
