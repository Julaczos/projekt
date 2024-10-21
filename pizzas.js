window.PizzaTypes = {
    normal: "normal",
    spicy: "spicy",
    veggie: "veggie",
    fungi: "fungi",
    chill: "chill",
  }
  
  window.Pizzas = {
    "s001": {
      name: "Gracz",
      description: "Pizza desc here",
      src: "/projekt/images/pizzaPicture.png",
      type: PizzaTypes.spicy,
      actions: [ "damage50", "clumsyStatus", "damage1" ],
    },
    "s002": {
      name: "Tomasz",
      description: "A salty warrior who fears nothing",
      src: "/projekt/images/pizzaPicture.png",
      type: PizzaTypes.spicy,
      actions: [ "damage1", "damage50", "clumsyStatus" ],
    },
    "v001": {
      name: "Call Me Kale",
      description: "Pizza desc here",
      src: "/projekt/images/pizzaPicture.png",
      type: PizzaTypes.veggie,
      actions: [ "damage1" ],
    },
    "f001": {
      name: "Portobello Express",
      description: "Pizza desc here",
      src: "/projekt/images/pizzaPicture.png",
      type: PizzaTypes.fungi,
      actions: [ "damage1" ],
    }
  }
