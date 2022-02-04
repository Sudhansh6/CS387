module.exports = app => {
    const venues = require("../controllers/venue.controller.js");
  
    var router = require("express").Router();
    // Section E, F
    router.get("/venues/add", venues.create);
    app.use('/api', router);
  };