const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;

exports.findPointsTable = (req, res) => {
    const year = req.params.year
    sequelize.query(`
      -- all teams
      -- team names
      select team_name as team, sum(matches) as matches, sum(won) as won, sum(ties) as ties,
      sum(lost) as lost, sum(nrr) as nrr, sum(points) as points
      from
      (
        -- team 1
        select team1 as team, 
        count(match.match_id) as matches, 
        sum((team1 = match_winner)::int) as won,
        sum((team2 = match_winner)::int) as lost,
        count(match.match_id) - sum((team1 = match_winner)::int) -sum((team2 = match_winner)::int) as ties,
        sum(case when match_winner = team1 and win_type = 'runs' then in1 - in2
          when match_winner = team2 and win_type = 'wickets' then in1 - in2
          else in2 - in1 end) as nrr,
        sum((team1 = match_winner)::int)*2 as points
        from match join 
        (
          -- getting NR of each match
          select match_id, 
          sum(case when innings_no = 1 then nr else 0 end) as in1,
          sum(case when innings_no = 2 then nr else 0 end) as in2 from
          (
            select match_id, innings_no, round(sum(runs_scored + extra_runs)*1.0/max(over_id), 3) as nr
            from ball_by_ball
            group by match_id, innings_no
          ) as nr_table
          group by match_id
        ) as nrs on nrs.match_id = match.match_id
        where season_year = ${year}
        group by team1
        
      -- 	
        UNION ALL 	
        -- team 2
        select team2 as team, 
        count(match.match_id) as matches, 
        sum((team2 = match_winner)::int) as won,
        sum((team1 = match_winner)::int) as lost,
        count(match.match_id) - sum((team2 = match_winner)::int) -sum((team1 = match_winner)::int) as ties,
        sum(case when match_winner = team2 and win_type = 'runs' then in1 - in2
          when match_winner = team1 and win_type = 'wickets' then in1 - in2
          else in2 - in1 end) as nrr,
        sum((team2 = match_winner)::int)*2 as points
        from match join
        (
          -- getting NR of each match
          select match_id,
          sum(case when innings_no = 1 then nr else 0 end) as in1,
          sum(case when innings_no = 2 then nr else 0 end) as in2 from
          (
            select match_id, innings_no, round(sum(runs_scored + extra_runs)*1.0/max(over_id), 3) as nr
            from ball_by_ball
            group by match_id, innings_no
          ) as nr_table
          group by match_id
        ) as nrs on nrs.match_id = match.match_id
        where season_year = ${year}
        group by team2
      ) as summary join 
      (select team_id, team_name from team) as t 
      on summary.team = t.team_id
      group by t.team_name
      order by points desc
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