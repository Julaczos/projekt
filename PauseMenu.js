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
      <div class="stats"></div> <!-- Placeholder dla statystyk -->
    `);
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  showStatistics() {
    const existingStatsElement = this.element.querySelector(".statsOverlay");
    if (existingStatsElement) {
      existingStatsElement.remove();
      return; 
    }

    const statsElement = document.createElement("div");
    statsElement.classList.add("statsOverlay");
    statsElement.innerHTML = `
      <h3>Twoje Statystyki</h3>
      <p>Poziom: ${window.GlobalStats.level}</p>
      <p>Doświadczenie: ${window.GlobalStats.xp} / ${window.GlobalStats.xpToNextLevel}</p>
      <p>Przysiady: ${window.GlobalStats.squatCount}</p>
      <p>Biceps Curls: ${window.GlobalStats.bicepCurlCount}</p>
      <p>Lokalizacja: ${window.GlobalStats.currentLocation}</p>
      <button id="closeStats">Zamknij</button>
    `;
    
    this.element.appendChild(statsElement);

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