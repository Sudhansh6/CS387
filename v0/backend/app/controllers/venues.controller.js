const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  sequelize.query(`
  `, {
    raw: true,
    type: db.Sequelize.QueryTypes.INSERT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
};

exports.findall = (req, res) => {
  sequelize.query(`
  select venue_id,venue_name from venue
`,
  {
    raw: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
};
exports.findbyid = (req, res) => { 
  sequelize.query(`
  select venue.venue_id,tot_matches,venue_name,city_name,country_name,capacity,highest_score,least_score,highscore_chased from venue
  join (select venue_id,count(match.match_id) as tot_matches,max(inning2_score) as highscore_chased,max(max_score) as highest_score,min(min_score) as least_score from match
  join (select out1.match_id,out1.sum as inning1_score,out2.sum as inning2_score,GREATEST(out1.sum,out2.sum)as max_score,Least(out1.sum,out2.sum) as min_score from
  (select match_id,sum(runs_scored+extra_runs) 
  from ball_by_ball
  where innings_no=1
  group by match_id
  order by match_id) as out1
  join (select match_id,sum(runs_scored+extra_runs) 
  from ball_by_ball
  where innings_no=2
  group by match_id
  order by match_id) as out2 on out1.match_id=out2.match_id) as out3 
  on out3.match_id=match.match_id
  group by venue_id) as out4 on out4.venue_id=venue.venue_id  
where venue.venue_id = ${req.params.id}
`,
  {
    raw: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
}