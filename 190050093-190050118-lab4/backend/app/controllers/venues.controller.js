const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;

exports.creates = (req, res) => {
  console.log(req.body);
  sequelize.query(`
  insert into venue (venue_name, city_name, country_name, capacity) 
  values ('${req.body.venue_name}', '${req.body.city_name}', '${req.body.country_name}', '${req.body.capacity}')
  `, {
    raw: true,
    quote: false,
    type: db.Sequelize.QueryTypes.INSERT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    console.log(err);
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
exports.highscorechased = (req, res) => {
  sequelize.query(`
  select venue_id,max(inning1_score) as highscore_chased from
  (select out1.match_id,out1.sum as inning1_score,match.win_type,match.venue_id,venue.venue_name
  from 
    (select match_id,sum(runs_scored+extra_runs) 
    from ball_by_ball
    where innings_no=1
    group by match_id
    order by match_id) as out1
    join (select match_id,sum(runs_scored+extra_runs) 
    from ball_by_ball
    where innings_no=2
    group by match_id
    order by match_id) as out2 on out1.match_id=out2.match_id
    join match on out2.match_id=match.match_id
    join venue on venue.venue_id=match.venue_id
    where win_type='wickets')as out3
    where venue_id=${req.params.id}
    group by venue_id
`,
  { raw: true, type: db.Sequelize.QueryTypes.SELECT }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
}

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
exports.tempfindbyid = (req, res) => {
  sequelize.query(`
  select venue_id,venue_name,city_name,country_name,capacity from venue
  where venue_id = ${req.params.id}
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
exports.matchoutline = (req, res) => {
  sequelize.query(`
  select 
sum(case when winner_innings =1 then 1 else 0 end) as batting_won,
sum(case when winner_innings =2 then 1 else 0 end) as bowling_won,
count(match_id) as tot_match
from (select match_id,(case when win_type = 'runs' then 1 else 2 end) as winner_innings,match_winner,team1,team2,venue_name,venue.venue_id
from match
join venue on venue.venue_id=match.venue_id) as out1
where venue_id=${req.params.id}
group by venue_id
order by venue_id
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
exports.avgfirstscore = (req, res) => {
  sequelize.query(`
  select season_year,round((1.0*sum(runs))/(1.0*count(match_id)),2) as avg_runs from
(select season_year,match.match_id,venue_id,sum(runs_scored+extra_runs) as runs from ball_by_ball
join match on match.match_id=ball_by_ball.match_id
where innings_no=1 and venue_id=${req.params.id}
group by season_year,match.match_id,venue_id
order by season_year,match.match_id) as out1
join venue on venue.venue_id = out1.venue_id
group by out1.venue_id,season_year
order by out1.venue_id,season_year
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