module.exports = app => {
    const players = require("../controllers/player.controller.js");
  
    var router = require("express").Router();
    router.get("/player/:id", players.findplayerinfo);
    router.get("/player/playerstat/:id", players.findplayerstat);
    router.get("/player/playercareer/:id", players.findplayercareer);
    router.get("/player/playerbowling/:id", players.findplayerbowling);
    router.get("/player/playerbowlstat/:id", players.findplayerbowlstat);
        app.use('/api', router);
  };