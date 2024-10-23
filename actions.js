window.Actions = {
  damage1: {
    name: "Zielony Cios",
    description: "Siła roślinnych składników",
    success: [
      { type: "textMessage", text: "{CASTER} używa ataku {ACTION}!"},
      { type: "animation", animation: "glob", color: "#35700d" },
      { type: "stateChange", damage: 5}
    ]
  },
damage50: {
    name: "Zdrowy Kop",
    description: "Kopniak z 50% szansy trafienia",
    success: [
      { type: "textMessage", text: "{CASTER} używa ataku {ACTION}!" },
      { type: "animation", animation: "glob", color: "#7160db" },
      { type: "yesOrNo", damage: 20 }
    ],
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
    name: "Napar ziołowy",
    description: "uczucie świeżości i oczyszczenia",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} wypija {ACTION}!"},
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Co za świeżość", },
    ]
  },
  item_recoverHp: {
    name: "Lecznicze jabłko",
    description: "Szybka dawka energii i siły",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: "{CASTER} zjada trochę owocu {ACTION}!", },
      { type:"stateChange", recover: 10, },
      { type:"textMessage", text: "{CASTER} odzyskuje zdrowie", },
    ]
  },
}
