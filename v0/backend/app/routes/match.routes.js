module.exports = app => {
    const matches = require("../controllers/match.controller.js");
  
    var router = require("express").Router();
    // Section B
    router.get("/match", matches.findAll);
    router.get("/match/batsmenInnings1/:id", matches.findBatsmenInnings1);
    router.get("/match/totalInnings1/:id", matches.findTotalInnings1);
    router.get("/match/bowlersInnings1/:id", matches.findBowlersInnings1);
    router.get("/match/batsmenInnings2/:id", matches.findBatsmenInnings2);
    router.get("/match/totalInnings2/:id", matches.findTotalInnings2);
    router.get("/match/bowlersInnings2/:id", matches.findBowlersInnings2);
        app.use('/api', router);
  };