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
  select sum(extra_runs) as extra_runs, 
  sum(runs_scored+extra_runs) as tot_runs,
  sum(case when extra_runs != 0 then 1 else 0 end) as extra_balls,
  sum(case when out_type != 'NULL' then 1 else 0 end) as tot_wickets
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
  sum(case when extra_runs != 0 then 1 else 0 end) as extra_balls,
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

exports.findMatchSummary = (req, res) => {
  const id = req.params.id
  var match_info;
  var players1;
  var players2;
  var umpires;

  sequelize.query(`
  select match_id, 
  t1.team_name as team1, 
  t2.team_name as team2, season_year,
  t3.team_name as toss_winner, toss_name,
  t4.team_name as match_winner,
  venue.venue_name as stadium_name,
  venue.city_name as city_name from (select * from match where match_id = ${id}) as m
  join team as t1 on t1.team_id = team1
  join team as t2 on t2.team_id = team2
  join team as t3 on t3.team_id = toss_winner
  join team as t4 on t4.team_id = match_winner
  join venue on venue.venue_id = m.venue_id;
  
  select umpire_name from
  (select match_id,umpire.umpire_name from umpire_match
  join umpire on umpire.umpire_id= umpire_match.umpire_id) as out2
  where out2.match_id = ${id};

  select player.player_id, player.player_name as player_name from player_match
  join player on player.player_id=player_match.player_id
  join match on match.match_id=player_match.match_id and 
  team_id=match.team1 and match.match_id=${id};

  select player.player_id, player.player_name as player_name from player_match
  join player on player.player_id=player_match.player_id
  join match on match.match_id=player_match.match_id and 
  team_id=match.team2 and match.match_id=${id};
  
  `, {
    raw: true,
    multipleStatements: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    var result = {match_info: data[0], umpires: [data[1], data[2], data[3]],
      players1: [data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11], data[12], data[13], data[14]],
      players2: [data[15], data[16], data[17], data[18], data[19], data[20], data[21], data[22], data[23], data[24], data[25]]
    };
    res.send(result);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
};

exports.findBestPlayers = (req, res) => {
  const id = req.params.id
  sequelize.query(`
  select player_id, player_name as batsman1, runs, balls from
  (
    select player_id, player_name, sum(runs_scored) as runs, count(runs_scored) as balls, rank() over (
    order by sum(runs_scored) desc,count(runs_scored) asc, player_name asc) as rank_batter
    from (select * from ball_by_ball where match_id = ${id}) as b
    join player on player.player_id = striker
    where innings_no = 1
    group by player_name, player_id
  )
  as out1
  where out1.rank_batter <= 3 and runs > 0;
  
  select player_id, player_name as batsman2, runs, balls from
  (
    select player_id, player_name, sum(runs_scored) as runs, count(runs_scored) as balls, rank() over (
    order by sum(runs_scored) desc,count(runs_scored) asc, player_name asc) as rank_batter
    from (select * from ball_by_ball where match_id = ${id}) as b
    join player on player.player_id = striker
    where innings_no = 2
    group by player_name, player_id
  )
  as out1
  where out1.rank_batter <= 3 and runs > 0;
  
  select player_id, player_name as bowler1, wickets, runs from
  (
    select player_id, player_name,
    sum(case when out_type != 'NULL' then 1 else 0 end)as wickets,
    sum(runs_scored) as runs,
    rank() over (
    order by sum(case when out_type != 'NULL' then 1 else 0 end) desc, sum(runs_scored) asc, player_name asc
    ) rank_batter
    from (select * from ball_by_ball where match_id = ${id}) as b
    join player on player.player_id=bowler
    where innings_no=1
    group by player_name, player_id
  )
  as out1
  where out1.rank_batter<=3 and wickets > 0 ;

  select player_id, player_name as bowler2, wickets, runs from
  (
    select player_name, player_id,
    sum(case when out_type != 'NULL' then 1 else 0 end)as wickets,
    sum(runs_scored) as runs,
    rank() over (
    order by sum(case when out_type != 'NULL' then 1 else 0 end) desc, sum(runs_scored) asc, player_name asc
    ) rank_batter
    from (select * from ball_by_ball where match_id = ${id}) as b
    join player on player.player_id=bowler
    where innings_no = 2
    group by player_name, player_id
  )
  as out1
  where out1.rank_batter<=3 and wickets > 0 ;
  `, {
    raw: true,
    multipleStatements: true,
    type: db.Sequelize.QueryTypes.SELECT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });


};
