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
  flag=false;
  matchInfo: any;

  constructor(private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (this.viewMode) {
      this.message = 'Loading...';
      this.getMatch(this.route.snapshot.params["id"]);
      this.plotBallbyBall(this.route.snapshot.params["id"]);
      this.flag=true;
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
    console.log(this.matchInfo);
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
    
    console.log(balls1, balls2)
    var ballByBall = new Chart("ballByBall", {
        type: "line",
        data: {
          labels: labels,
          datasets:[
            {fill: false,
              borderColor: 'rgba(29, 236, 197, 0.5)',
              pointStyle: 'circle',
              label: "Innings 1", data : balls1}, 
            {fill: false,
              borderColor: 'rgba(91, 14, 214, 0.5)',
              pointStyle: 'circle',
              label: "Innings 2", data : balls2},
          ]
        },
        options: {
          elements: {
            point: {
              radius : customRadius
            }
          }
        }
      });
      function customRadius(context: any)
      {
        // console.log(context.dataset.label);
        let index = context.dataIndex;
        let value = false;
        if (context.dataset.label == "Innings 1")
          value = wickets1[index];
        else
          value = wickets2[index];
        return value ? 5 : 0.5;
      }
  }

  redirectPlayer(id: string): void {
    this.router.navigate([`/players/${id}`]);
  }

}
