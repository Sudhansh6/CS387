module.exports = app => {
    const venues = require("../controllers/venues.controller.js");
  
    var router = require("express").Router();
    // Section E, F
    router.get("/venues/add", venues.create);
    router.get("/venues", venues.findall);
    router.get("/venues/:id", venues.findbyid);
    app.use('/api', router);
  };
  
