window.Actions = {
  damage1: {
    name: "Zielony Cios",
    description: "Siła roślinnych składników",
    success: [
      { type: "textMessage", text: "{CASTER} używa ataku {ACTION}!"},
      { type: "animation", animation: "glob", color: "#35700d" },
      { type: "stateChange", damage: 10}
    ]
  },
saucyStatus: {
    name: "Zdrowy Kop",
    description: "Kopniak z 50% szansy trafienia",
    success: [
      { type: "textMessage", text: "{CASTER} używa ataku {ACTION}!" },
      { type: "animation", animation: "glob", color: "#7160db" },
      { type: "yesOrNo", damage: 20 }
    ],
    execute: async function(caster, target, resolve) {
      const battleEvent = new BattleEvent({ 
        type: "textMessage", 
        text: this.success[0].text, 
        caster: caster,
        target: target,
        action: this.name 
      }, this.battle);
      await battleEvent.textMessage(() => {});

      // Uruchom animację
      const animationEvent = new BattleEvent({
        type: "animation",
        animation: this.success[1].animation,
        color: this.success[1].color
      }, this.battle);
      await animationEvent.animation(() => {});

      // Wywołaj yesOrNo
      const yesNoEvent = new BattleEvent({
        type: "yesOrNo",
        caster: caster,
        target: target,
        damage: 20 // Możesz ustawić inne wartości
      }, this.battle);
      const result = await yesNoEvent.yesOrNo(() => {});

      // Jeżeli odpowiedź to "tak", wykonaj zmiany stanu
      if (result === "tak") {
        target.update({ hp: target.hp - 20 }); // Zadaj obrażenia
        console.log(`${caster.name} zadał 20 obrażeń ${target.name}!`);
      } else {
        console.log(`${caster.name} nie trafił!`);
      }

      resolve(); // Zakończ wykonywanie
    }
  },

  clumsyStatus: {
    name: "Olive Oil",
    description: "Slippery mess of deliciousness",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "clumsy", expiresIn: 3 } },
      { type: "textMessage", text: "{TARGET} is slipping all around!"},
    ]
  },
  //Items
  item_recoverStatus: {
    name: "Heating Lamp",
    description: "Feeling fresh and warm",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Feeling fresh!", },
    ]
  },
  item_recoverHp: {
    name: "Parmesan",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: "{CASTER} sprinkles on some {ACTION}!", },
      { type:"stateChange", recover: 10, },
      { type:"textMessage", text: "{CASTER} recovers HP!", },
    ]
  },
}
