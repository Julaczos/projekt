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
    ]
  },
  clumsyStatus: {
    name: "Olive Oil",
    description: "Slippery mess of deliciousness",
    success: [
      { type: "textMessage", text: "{CASTER} używa {ACTION}!" },
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "clumsy", expiresIn: 3 } },
      { type: "textMessage", text: "{TARGET} is slipping all around!" },
    ]
  },
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
      { type: "textMessage", text: "{CASTER} recovers HP!" },
    ]
  },
};

function executeAction(actionName, caster, target) {
  const action = window.Actions[actionName];
  
  if (!action) {
    console.error(`Action "${actionName}" not found.`);
    return;
  }

  console.log(action.success[0].text.replace("{CASTER}", caster).replace("{ACTION}", action.name));

  if (actionName === "saucyStatus") {
    const hitSuccess = utils.randomYesOrNo() === "tak"; 

    if (hitSuccess) {
      console.log(action.success[1].text.replace("{CASTER}", caster).replace("{ACTION}", action.name));
      const damageEffect = { type: "stateChange", damage: 20 };
      console.log(`Damage dealt: ${damageEffect.damage} to ${target}`);
    } else {
      console.log(`${caster} nie trafił!`);
    }
  }

  action.success.forEach(effect => {
    console.log(`Effect: ${effect.type}`);
    if (effect.type === "stateChange") {
      if (effect.damage) {
        console.log(`Damage effect: ${effect.damage}`);
      } else if (effect.status) {
        console.log(`Status effect: ${effect.status.type}`);
      }
    }
  });
}
