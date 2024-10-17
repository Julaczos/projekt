window.PizzaTypes = {
    normal: "normal",
    spicy: "spicy",
    veggie: "veggie",
    fungi: "fungi",
    chill: "chill",
  }
  
  window.Pizzas = {
    "s001": {
      name: "Slice Samurai",
      description: "Pizza desc here",
      type: PizzaTypes.spicy,
      actions: [ "saucyStatus", "clumsyStatus", "damage1" ],
    },
    "s002": {
      name: "Bacon Brigade",
      description: "A salty warrior who fears nothing",
      type: PizzaTypes.spicy,
      actions: [ "damage1", "saucyStatus", "clumsyStatus" ],
    },
    "v001": {
      name: "Call Me Kale",
      description: "Pizza desc here",
      type: PizzaTypes.veggie,
      actions: [ "damage1" ],
    },
    "f001": {
      name: "Portobello Express",
      description: "Pizza desc here",
      type: PizzaTypes.fungi,
      actions: [ "damage1" ],
    }
  }