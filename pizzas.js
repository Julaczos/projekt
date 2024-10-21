window.PizzaTypes = {
    normal: "normal",
    spicy: "spicy",
    veggie: "veggie",
    fungi: "fungi",
    chill: "chill",
  }
  
  window.Pizzas = {
    "s001": {
      name: "Tomasz",
      description: "Pizza desc here",
      src: "/projekt/images/pizzaPicture.png",
      type: PizzaTypes.spicy,
      actions: [ "saucyStatus", "clumsyStatus", "damage1" ],
    },
    "s002": {
      name: "Bacon Brigade",
      description: "A salty warrior who fears nothing",
      src: "/projekt/images/pizzaPicture.png",
      type: PizzaTypes.spicy,
      actions: [ "damage1", "saucyStatus", "clumsyStatus" ],
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
