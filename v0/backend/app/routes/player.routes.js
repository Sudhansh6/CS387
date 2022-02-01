module.exports = app => {
    const players = require("../controllers/player.controller.js");
  
    var router = require("express").Router();
    // Section B
    router.get("/player/:id", players.findplayerinfo);
    router.get("/player/playerstat/:id", players.findplayerstat);
        app.use('/api', router);
  };