module.exports = app => {
    const pointsTable = require("../controllers/pointsTable.controller.js");
  
    var router = require("express").Router();
    // Section D
    router.get("/pointsTable/:year", pointsTable.findPointsTable);
    app.use('/api', router);
  };