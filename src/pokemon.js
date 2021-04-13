const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");

const name = "Venkat Mithun Kadiyala";

console.log(`My name is ${name}`);

// From MDN Docs
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const myPokemon = {
  pokemonById: {
    "fc10b559-872c-43cd-bad2-f02e2e0a2d58": {
      id: "fc10b559-872c-43cd-bad2-f02e2e0a2d58",
      name: "Pikachu",
      health: 10,
      level: 1,
    },
  },
  ids: ["fc10b559-872c-43cd-bad2-f02e2e0a2d58"],
};

const addPokemon = (name) => {
  if (name) {
    for (const id of myPokemon.ids) {
      if (myPokemon.pokemonById[id].name === name) {
        return false;
      }
    }
    const newId = uuid();
    const newPokemon = {
      id: newId,
      name: name,
      level: getRandomIntInclusive(1, 10),
      health: getRandomIntInclusive(10, 100),
    };
    myPokemon.pokemonById[newId] = newPokemon;
    myPokemon.ids.push(newId);
    return true;
  }
  return false;
};

router.get("/", function (req, res) {
  return res.json(Object.values(myPokemon.pokemonById));
});

//Expecting JSON object with name to be sent in req body
router.post("/", (req, res) => {
  console.log("post add pokemon", req.body);
  if (addPokemon(req.body.name)) {
    return res.sendStatus(200);
  } else {
    throw new Error("Error adding Pokemon!");
  }
});

router.get("/:pokemonId", function (req, res) {
  const requiredPokemon = myPokemon.pokemonById[req.params.pokemonId];
  if (requiredPokemon) {
    return res.json(requiredPokemon);
  } else {
    return res.sendStatus(404);
  }
});

router.put("/:pokemonId", function (req, res) {
  const id = req.params.pokemonId;
  if (
    id &&
    req.body &&
    Object.keys(req.body).length !== 0 &&
    req.body.constructor === Object
  ) {
    let requiredPokemon = myPokemon.pokemonById[id];
    if (requiredPokemon) {
      myPokemon.pokemonById[id] = { ...requiredPokemon, ...req.body };
      return res.send("Pokemon updated!");
    } else {
      return res.sendStatus(404);
    }
  } else {
    return res.sendStatus(404);
  }
});

router.delete("/:pokemonId", function (req, res) {
  const id = req.params.pokemonId;
  const requiredPokemon = myPokemon.pokemonById[id];
  if (requiredPokemon) {
    const idx = myPokemon.ids.indexOf(id);
    myPokemon.ids.splice(idx, 1);
    delete myPokemon.pokemonById[id];
    return res.sendStatus(200);
  }

  return res.sendStatus(404);
});

module.exports = router;
