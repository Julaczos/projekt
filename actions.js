window.Actions = {
  damage1: {
    name: "Zielony Cios",
    description: "Siła roślinnych składników",
    success: [
      { type: "textMessage", text: "{CASTER} używa ataku {ACTION}!" },
      { type: "animation", animation: "glob", color: "#35700d" },
      { type: "stateChange", damage: 10 }
    ]
  },
  saucyStatus: {
    name: "Zdrowy Kop",
    description: "Kopniak z 50% szansy trafienia",
    success: [
      { type: "textMessage", text: "{CASTER} używa ataku {ACTION}!" },
      { type: "animation", animation: "glob", color: "#7160db" },
      { type: "stateChange", damage: null } 
    ],
    execute: function(caster, target) {
      const hitSuccess = Math.random() < 0.5;
      console.log(hitSuccess);
      console.log(this.success[0].text.replace("{CASTER}", caster).replace("{ACTION}", this.name));

      if (hitSuccess) {
        console.log(this.success[1].text.replace("{CASTER}", caster).replace("{ACTION}", this.name));
        
        const damage = 20;
        this.success[2].damage = damage; 

        console.log(`Zadane obrażenia: ${damage} dla ${target}`);
      } else {
        console.log(`${caster} nie trafił!`);
      }

      this.success.forEach(effect => {
        console.log(`Efekt: ${effect.type}`);
        if (effect.type === "stateChange") {
          if (effect.damage) {
            console.log(`Efekt obrażeń: ${effect.damage}`);
          } else if (effect.status) {
            console.log(`Efekt statusu: ${effect.status.type}`);
          }
        }
      });
    }
  },
  clumsyStatus: {
    name: "Olive Oil",
    description: "Slippery mess of deliciousness",
    success: [
      { type: "textMessage", text: "{CASTER} używa {ACTION}!" },
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "clumsy", expiresIn: 3 } },
      { type: "textMessage", text: "{TARGET} jest śliski!" },
    ]
  },
  // Items
  item_recoverStatus: {
    name: "Heating Lamp",
    description: "Feeling fresh and warm",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} używa {ACTION}!" },
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Feeling fresh!" },
    ]
  },
  item_recoverHp: {
    name: "Parmesan",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} sprinkles on some {ACTION}!" },
      { type: "stateChange", recover: 10 },
      { type: "textMessage", text: "{CASTER} odzyskuje HP!" },
    ]
  },
};
