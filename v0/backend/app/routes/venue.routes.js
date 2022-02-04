module.exports = app => {
    const venues = require("../controllers/venues.controller.js");
  
    var router = require("express").Router();
    // Section E, F
    router.post("/venues/add", venue.create);
    router.get("/venues", venues.findall);
    router.get("/venues/:id", venues.findbyid);
    const venue = require("../controllers/venues.controller.js");

    app.use('/api', router);
  };
  
