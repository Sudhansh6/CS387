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
    router.get("/match/ballsInnings1/:id", matches.findBallsInnings1);
    router.get("/match/ballsInnings2/:id", matches.findBallsInnings2);
    router.get("/match/matchInfo/:id", matches.findMatchSummary);
    router.get("/match/bestPlayers/:id", matches.findBestPlayers);
    router.get("/match/distribution1/:id", matches.findDistribution1);
    router.get("/match/distribution2/:id", matches.findDistribution2);




        app.use('/api', router);
  };