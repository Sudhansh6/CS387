const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;


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
    select match_id,striker,runs,wicket_stat,round((1.0*aggregate_runs)/(case when aggregate_wickets!=0 then aggregate_wickets*1.0 else 1.0 end),2) as average from
(select *,
sum(runs) over(
	order by match_id
	rows unbounded preceding
) as aggregate_runs,
sum(wicket_stat) over(
	order by match_id
	rows unbounded preceding
) as aggregate_wickets
from (select match_id,striker,sum(runs_scored) as runs,
sum(case when out_type!='NULL' then 1 else 0 end) as wicket_stat
from ball_by_ball
join player on player.player_id=ball_by_ball.striker
where striker=${id}
group by match_id,striker
order by match_id) as out1) as out2`,
    {
      raw: true,
      type: db.Sequelize.QueryTypes.SELECT
    }).then((data) => {
      res.send(data);
    }).catch((err) => {
      res.send(`There was an error while fetching data from the database - ${err}`);
    });
  };
  exports.findplayercareer = (req, res) => {
    const id = req.params.id
    sequelize.query(`
    select out3.striker,matches,runs,fours,sixes,fifty,hs,strike_rate,average from
(select striker,count(distinct match_id) as matches,sum(runs_scored) as runs,
coalesce(sum(case runs_scored when 6 then 6 else null end),0) as sixes,
coalesce(sum(case runs_scored when 4 then 4 else null end),0) as fours,
coalesce(round(((sum(runs_scored)*1.0)/(1.0*count(runs_scored)))*100,2),0) as strike_rate,
round((sum(runs_scored)*1.0)/(case when (sum(case when out_type != 'NULL' then 1 else 0 end)*1.0) !=0 then (sum(case when out_type != 'NULL' then 1 else 0 end)*1.0) else 1 end),2) as average
from ball_by_ball
join player on player.player_id=ball_by_ball.striker
group by striker
order by striker) as out3,
(select striker,max(runs_match) as hs,sum(case when runs_match>=50 then 1 else 0 end) as fifty
from (select match_id,striker,sum(runs_scored) as runs_match from ball_by_ball
group by striker,match_id) as out1
group by striker) as out2 
where out2.striker=out3.striker  and out3.striker=${id}`,
    {
      raw: true,
      type: db.Sequelize.QueryTypes.SELECT
    }).then((data) => {
      res.send(data);
    }).catch((err) => {
      res.send(`There was an error while fetching data from the database - ${err}`);
    });
  };
  exports.findplayerbowling = (req, res) => {
    const id = req.params.id
    sequelize.query(`
    select out3.bowler,matches,runs,wickets,overs,balls,round((1.0*runs)/(1.0*overs),2) as economy,out2.five_wickets from
(select ball_by_ball.bowler,count(distinct match_id) as Matches,sum(runs_scored) as Runs,
 sum(case when out_type!='NULL' then 1 else 0 end) as wickets,count(runs_scored) as balls
from ball_by_ball 
group by bowler) as out3
join (select bowler,sum(overs_match)as overs,sum(case when wickets_match >=5 then 1 else 0 end) as five_wickets  from
(select match_id,bowler,count(distinct over_id) as overs_match,sum(case when out_type!='NULL' then 1 else 0 end) as wickets_match
from ball_by_ball
group by match_id,bowler
order by bowler) as out1
group by bowler) as out2 on out2.bowler = out3.bowler
where out3.bowler =${id}`,
    {
      raw: true,
      type: db.Sequelize.QueryTypes.SELECT
    }).then((data) => {
      res.send(data);
    }).catch((err) => {
      res.send(`There was an error while fetching data from the database - ${err}`);
    });
  };
  exports.findplayerbowlstat = (req, res) => {
    const id = req.params.id
    sequelize.query(`
    select bowler,match_id,sum(runs_scored) as runs_match,sum(case when out_type !='NULL' then 1 else 0 end) as wickets_match from ball_by_ball
    where bowler=${id}
    group by bowler,match_id
    order by bowler, match_id`,
    {
      raw: true,
      type: db.Sequelize.QueryTypes.SELECT
    }).then((data) => {
      res.send(data);
    }).catch((err) => {
      res.send(`There was an error while fetching data from the database - ${err}`);
    });
  };