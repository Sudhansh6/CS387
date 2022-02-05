module.exports = app => {
    const venues = require("../controllers/venues.controller.js");
  
    var router = require("express").Router();
    // Section E, F
    router.post("/venues/add", venues.creates);
    router.get("/venues", venues.findall);
    router.get("/venue/:id", venues.findbyid);
    router.get("/venue/temp/:id", venues.tempfindbyid);
    router.get("/venue/matchoutline/:id", venues.matchoutline);
    router.get("/venue/avgfirstscore/:id", venues.avgfirstscore);
    router.get("/venue/highscore/:id", venues.highscorechased);
    app.use('/api', router);
  };
  
