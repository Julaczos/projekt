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

      
      const animationEvent = new BattleEvent({
        type: "animation",
        animation: this.success[1].animation,
        color: this.success[1].color
      }, this.battle);
      await animationEvent.animation(() => {});

    
      const yesNoEvent = new BattleEvent({
        type: "yesOrNo",
        caster: caster,
        target: target,
        damage: 20
      }, this.battle);
      const result = await yesNoEvent.yesOrNo(() => {});

    
      if (result === "tak") {
        target.update({ hp: target.hp - 20 }); // Zadaj obrażenia
        console.log(`${caster.name} zadał 20 obrażeń ${target.name}!`);
      } else {
        console.log(`${caster.name} nie trafił!`);
      }

      resolve(); 
    }
  },

  clumsyStatus: {
    name: "Naoliwienie",
    description: "Śliskie źródło witamin A, B, C, D, E, K",
    success: [
      { type: "textMessage", text: "{CASTER} używa ataku {ACTION}!"},
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "śliski", expiresIn: 3 } },
      { type: "textMessage", text: "{TARGET} jest cały śliski"},
    ]
  },
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
    name: "Lecznicze jabłko",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: "{CASTER} zjada trochę owocu {ACTION}!", },
      { type:"stateChange", recover: 10, },
      { type:"textMessage", text: "{CASTER} odzyskuje zdrowie", },
    ]
  },
}
