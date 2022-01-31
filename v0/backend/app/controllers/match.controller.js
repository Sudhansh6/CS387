const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Match = db.match;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    sequelize.query(`
    select match_id, t2.team_name as team1, t3.team_name as team2, venue_name as stadium_name, city_name,
    t1.team_name as winning_team, win_type, win_margin, season_year from match 
    join venue on venue.venue_id=match.venue_id
    join team as t1 on match.match_winner=t1.team_id 
    join team as t2 on match.team1=t2.team_id 
    join team as t3 on match.team2=t3.team_id 
    order by season_year desc`,
    {
      raw: true,
      type: db.Sequelize.QueryTypes.SELECT
    }).then((data) => {
      res.send(data);
    }).catch((err) => {
      res.send(`There was an error while fetching data from the database - ${err}`);
    });
  };

// Find a single Tutorial with an id
exports.findBatsmenInnings1 = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select player.player_name as player_name, out1.Runs as runs, out1.fours as fours,
   out1.sixes as sixes, out1.Balls_faced as balls from
  (
    select striker,sum(runs_scored) as Runs,count( case runs_scored when 4 then 1 else null end)as fours,count( case runs_scored when 6 then 1 else null end)as sixes,count(runs_scored) as Balls_faced
    from ball_by_ball 
    where innings_no = 1 and match_id = ${id}
    group by striker
  ) as out1
  join player on player.player_id=out1.striker`, {
    raw: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  
};