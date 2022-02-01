const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  
};

// Retrieve all matches from the database.
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

// Find batsmen info for innings 1 of a match
exports.findBatsmenInnings1 = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select player.player_id as player_id, player.player_name as player_name, 
  out1.Runs as runs, out1.fours as fours,
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

// Find total info for innings 1 of a match
exports.findTotalInnings1 = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select sum(extra_runs) as extra_runs, sum(runs_scored+extra_runs) as tot_runs,sum(case when out_type != 'NULL' then 1 else 0 end) as tot_wickets
  from ball_by_ball 
  where innings_no=1 and match_id=${id}
  `, {
    raw: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
};

// Find bowlers info for innings 1 of a match
exports.findBowlersInnings1 = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select player.player_id as player_id, player.player_name as player_name, 
  out1.balls_bowled as balls,
  out1.runs_given as runs,
  out1.wickets_taken as wickets
  from
  (select bowler,count(bowler) as balls_bowled, sum(runs_scored) as runs_given,sum(case when out_type != 'NULL' then 1 else 0 end) as wickets_taken
  from ball_by_ball 
  where innings_no=1 and match_id=${id}
  group by bowler) as out1
  join player on player.player_id=out1.bowler
  `, {
    raw: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
};

// Find batsmen info for innings 2 of a match
exports.findBatsmenInnings2 = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select player.player_id as player_id, player.player_name as player_name, 
  out1.Runs as runs, out1.fours as fours,
   out1.sixes as sixes, out1.Balls_faced as balls from
  (
    select striker,sum(runs_scored) as Runs,count( case runs_scored when 4 then 1 else null end)as fours,count( case runs_scored when 6 then 1 else null end)as sixes,count(runs_scored) as Balls_faced
    from ball_by_ball 
    where innings_no = 2 and match_id = ${id}
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

// Find total info for innings 2 of a match
exports.findTotalInnings2 = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select sum(extra_runs) as extra_runs, 
  sum(runs_scored+extra_runs) as tot_runs,
  sum(case when out_type != 'NULL' then 1 else 0 end) as tot_wickets
  from ball_by_ball 
  where innings_no = 2 and match_id=${id}
  `, {
    raw: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
};

// Find bowlers info for innings 2 of a match
exports.findBowlersInnings2 = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select player_id as player_id, player.player_name as player_name, 
  out1.balls_bowled as balls,
  out1.runs_given as runs,
  out1.wickets_taken as wickets
  from
  (select bowler,count(bowler) as balls_bowled, sum(runs_scored) as runs_given,sum(case when out_type != 'NULL' then 1 else 0 end) as wickets_taken
  from ball_by_ball 
  where innings_no = 2 and match_id=${id}
  group by bowler) as out1
  join player on player.player_id=out1.bowler
  `, {
    raw: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });


};

// Find ball by ball info of a match
exports.findBallsInnings1 = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select over_id*6+ball_id-6 as ball,
  sum(runs_scored + extra_runs) over (
    partition by match_id
    order by over_id*6+ball_id-6
    rows unbounded preceding
  ) as runs, 
  case when out_type != 'NULL' then 1 else 0 end as wickets, out_type
  from ball_by_ball 
  where innings_no=1 and match_id = ${id}
  `, {
    raw: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });


};

exports.findBallsInnings2 = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select over_id*6+ball_id-6 as ball,
  sum(runs_scored + extra_runs) over (
    partition by match_id
    order by over_id*6+ball_id-6
    rows unbounded preceding
  ) as runs, 
  case when out_type != 'NULL' then 1 else 0 end as wickets, out_type
  from ball_by_ball 
  where innings_no = 2 and match_id = ${id}
  `, {
    raw: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });


};
