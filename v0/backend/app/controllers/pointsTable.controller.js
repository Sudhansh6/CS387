const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;

exports.findPointsTable = (req, res) => {
    const year = req.params.year
    sequelize.query(`
    -- all teams
    -- team names
    with params as (
      select match_id, 
      sum((runs_scored + extra_runs)*(innings_no = 1)::int) as in1_runs,
      sum((runs_scored + extra_runs)*(innings_no = 2)::int) as in2_runs,
      max(over_id*(innings_no = 1)::int) as in1_overs,
      max(over_id*(innings_no = 2)::int) as in2_overs
      from ball_by_ball
      group by match_id
    )
    select 
    team_name as team, sum(matches) as matches, sum(won) as won, sum(ties) as ties,
    sum(lost) as lost, 
    round(sum(my_runs)*1.0/sum(my_overs) - sum(opp_runs)*1.0/sum(opp_overs), 3) as nrr,
    sum(points) as points
    from
      (
      -- team 1
      select team1 as team, 
      count(match.match_id) as matches,
      sum((team1 = match_winner)::int) as won,
      sum((team2 = match_winner)::int) as lost,
      count(match.match_id) - sum((team1 = match_winner)::int) -sum((team2 = match_winner)::int) as ties,
      sum(case when match_winner = team1 and win_type = 'runs' then in1_runs
        when match_winner = team2 and win_type = 'wickets' then in1_runs
        else in2_runs end) as my_runs,
        sum(case when match_winner = team2 and win_type = 'runs' then in2_runs
        when match_winner = team1 and win_type = 'wickets' then in2_runs
        else in1_runs end) as opp_runs,
      sum(case when match_winner = team1 and win_type = 'runs' then in1_overs
        when match_winner = team2 and win_type = 'wickets' then in1_overs
        else in2_overs end) as my_overs,
        sum(case when match_winner = team2 and win_type = 'runs' then in2_overs
        when match_winner = team1 and win_type = 'wickets' then in2_overs
        else in1_overs end) as opp_overs,
      sum((team1 = match_winner)::int)*2 as points
      from match join params on params.match_id = match.match_id
      where season_year = ${year}
      group by team1
      
      union all
        
      -- team 1
      select team2 as team, 
      count(match.match_id) as matches,
      sum((team2 = match_winner)::int) as won,
      sum((team1 = match_winner)::int) as lost,
      count(match.match_id) - sum((team2 = match_winner)::int) -sum((team1 = match_winner)::int) as ties,
      sum(case when match_winner = team2 and win_type = 'runs' then in1_runs
        when match_winner = team1 and win_type = 'wickets' then in1_runs
        else in2_runs end) as my_runs,
        sum(case when match_winner = team1 and win_type = 'runs' then in2_runs
        when match_winner = team2 and win_type = 'wickets' then in2_runs
        else in1_runs end) as opp_runs,
      sum(case when match_winner = team2 and win_type = 'runs' then in1_overs
        when match_winner = team1 and win_type = 'wickets' then in1_overs
        else in2_overs end) as my_overs,
        sum(case when match_winner = team1 and win_type = 'runs' then in2_overs
        when match_winner = team2 and win_type = 'wickets' then in2_overs
        else in1_overs end) as opp_overs,
      sum((team2 = match_winner)::int)*2 as points
      from match join params on params.match_id = match.match_id
      where season_year = ${year}
      group by team2
    ) as summary join 
    (select team_id, team_name from team) as t 
    on summary.team = t.team_id
    group by t.team_name
    order by points desc, nrr desc
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