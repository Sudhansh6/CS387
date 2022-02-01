import { Component, Input, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/match.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss']
})
export class MatchDetailsComponent implements OnInit {

  @Input() viewMode = true;

  batsmenInnings1: any;
  totalInnings1 : any;
  bowlersInnings1: any;
  
  batsmenInnings2: any;
  totalInnings2 : any;
  bowlersInnings2: any;

  ballsInnings1: any;
  ballsInnings2: any;
  message = '';
  matchInfo: any;
  ballByBallChart: any;
  flag = false;

  battingTeamInnings1: any;
  battingTeamInnings2: any;

  bestInnings1batsmen = new Array();
  bestInnings1bowlers = new Array();
  bestInnings2batsmen = new Array();
  bestInnings2bowlers = new Array();

  constructor(private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (this.viewMode) {
      this.message = 'Loading...';
      this.getMatch(this.route.snapshot.params["id"]);
      
    }
  }

  async getMatch(id: string) {
    console.log("Fetching data...")
    this.batsmenInnings1 = await lastValueFrom(this.matchService.getBatsmenInnings1(id));
    this.totalInnings1 = await lastValueFrom(this.matchService.getTotalInnings1(id));
    this.bowlersInnings1 = await lastValueFrom(this.matchService.getBowlersInnings1(id));
    
    this.batsmenInnings2 = await lastValueFrom(this.matchService.getBatsmenInnings2(id));
    this.totalInnings2 = await lastValueFrom(this.matchService.getTotalInnings2(id));
    this.bowlersInnings2 = await lastValueFrom(this.matchService.getBowlersInnings2(id));
  
    this.matchInfo = await lastValueFrom(this.matchService.getMatchInfo(id));

 
    if (this.matchInfo.match_info.win_type == "wickets")
    {
        this.battingTeamInnings2 = this.matchInfo.match_info.match_winner;
        if (this.matchInfo.match_info.match_winner == this.matchInfo.match_info.team1 )
          this.battingTeamInnings1 = this.matchInfo.match_info.team2;
        else
          this.battingTeamInnings1 = this.matchInfo.match_info.team1;
    }
    else
    {
        this.battingTeamInnings1 = this.matchInfo.match_info.match_winner;
        if (this.matchInfo.match_info.match_winner == this.matchInfo.match_info.team1 )
          this.battingTeamInnings2 = this.matchInfo.match_info.team2;
        else
          this.battingTeamInnings2 = this.matchInfo.match_info.team1;
    }
    this.plotBallbyBall(id);
    this.bestPlayers(id);
  }

  async plotBallbyBall(id: string)
  {
    this.ballsInnings1 = await lastValueFrom(this.matchService.getBallsInnings1(id));
    this.ballsInnings2 = await lastValueFrom(this.matchService.getBallsInnings2(id));

    var len = Math.max(this.ballsInnings1.length, this.ballsInnings2.length);
    var labels = new Array(len) 
    var balls1 = new Array(this.ballsInnings1.length);
    var balls2 = new Array(this.ballsInnings2.length);
    var wickets1 = new Array(this.ballsInnings1.length);
    var wickets2 = new Array(this.ballsInnings2.length);

    
    this.ballsInnings1.forEach((element: any, i: number) => {
      labels[i] = element.ball;
      balls1[i] = Number(element.runs);
      wickets1[i] = Boolean(element.wickets);
    });

    this.ballsInnings2.forEach((element: any, i: number) => {
      balls2[i] = Number(element.runs);
      wickets2[i] = Boolean(element.wickets);
    });

    
    this.ballByBallChart = new Chart("BallByBallChart",
    {
      type: "line",
      data: {
        labels: labels,
        datasets:[
          {fill: false,
            borderColor: 'rgba(29, 236, 197, 0.5)',
            pointStyle: 'circle',
            pointRadius: pointRadius1,
            label: this.battingTeamInnings1, data : balls1}, 
          {fill: false,
            borderColor: 'rgba(91, 14, 214, 0.5)',
            pointStyle: 'circle',
            pointRadius: pointRadius2,
            label: this.battingTeamInnings2, data : balls2},
          ]
        },
        options: {}
      });

      function pointRadius1(context: any)
      {
        let index = context.dataIndex;
        let value = false;
        value = wickets1[index];
        return value ? 10 : 1;
      }
      function pointRadius2(context: any)
      {
        let index = context.dataIndex;
        let value = false;
        value = wickets2[index];
        return value ? 10 : 1;
      }
  }

  async bestPlayers(id: string)
  {
    var res = await lastValueFrom(this.matchService.getBestPlayers(id));
    res.forEach((element: any) => {
      if (element.batsman1 != null)
        this.bestInnings1batsmen.push(element);
      else if (element.batsman2 != null)
        this.bestInnings2batsmen.push(element);
      else if (element.bowler1 != null)
        this.bestInnings1bowlers.push(element); 
      else if (element.bowler2 != null)
        this.bestInnings2bowlers.push(element);
    });
    // console.log(this.bestInnings1batsmen);
    this.flag = true;
  }

  redirectPlayer(id: string): void {
    this.router.navigate([`/players/${id}`]);
  }

}
