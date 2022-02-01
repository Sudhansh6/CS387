const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  
};


// Retrieve all matches from the database.
exports.findplayerinfo = (req, res) => {
    const id = req.params.id
    sequelize.query(`
    select player_name, country_name,batting_hand as batting_skill,bowling_skill 
    from player where player_id=${id}`,
    {
      raw: true,
      type: db.Sequelize.QueryTypes.SELECT
    }).then((data) => {
      res.send(data);
    }).catch((err) => {
      res.send(`There was an error while fetching data from the database - ${err}`);
    });
  };

  exports.findplayerstat = (req, res) => {
    const id = req.params.id
    sequelize.query(`
    select match_id,striker,sum(runs_scored) as runs from ball_by_ball
    join player on player.player_id=ball_by_ball.striker
    where striker=${id}
    group by match_id,striker
    order by match_id`,
    {
      raw: true,
      type: db.Sequelize.QueryTypes.SELECT
    }).then((data) => {
      res.send(data);
    }).catch((err) => {
      res.send(`There was an error while fetching data from the database - ${err}`);
    });
  };