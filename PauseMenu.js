let stats_visible = false;

class PauseMenu {
  constructor({progress,  onComplete }) {
    this.progress = progress;
    this.onComplete = onComplete;
  }

  getOptions(pageKey) {
    if (pageKey === "root") {
      return [
        {
          label: "Zapisz",
          description: "Zapisz swój progres",
          handler: () => {
            this.progress.save();
            this.close();
          }
        },
        {
          label: "Statystyki",
          description: "Zobacz statystyki",
          handler: () => {
            if (!stats_visible) this.showStatistics();
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
    stats_visible = true;
    const statsElement = document.createElement("div");
    statsElement.classList.add("statsOverlay");
    statsElement.innerHTML = `
      <h3>Twoje Statystyki</h3>
      <p>Poziom: ${window.playerState.pizzas.p1.level}</p>
      <p>Doświadczenie: ${window.playerState.pizzas.p1.xp} / ${window.playerState.pizzas.p1.maxXp}</p>
      <p>Przysiady: ${window.playerState.squatCount}</p>
      p>Podnoszenie ciężarków: ${window.playerState.bicepCurlCount}</p>
      <p>Skłony: ${window.playerState.bicepCurlCount}</p>
      <button id="closeStats">Zamknij</button>
    `;

    document.body.appendChild(statsElement);

    document.getElementById("closeStats").addEventListener("click", () => {
      statsElement.remove();
      stats_visible = false;
    });
  }

  init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
       //descriptionContainer: game-container
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
