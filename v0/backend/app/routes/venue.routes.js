module.exports = app => {
    const venue = require("../controllers/venues.controller.js");
  
    var router = require("express").Router();
    // Section E, F
    router.post("/venues/add", venue.create);
    app.use('/api', router);
  };