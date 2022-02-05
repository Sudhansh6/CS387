import { Component, Input, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit {
  @Input() viewMode = true;

  playerinfo: any;
  playerstat: any;
  playercareer: any;
  message = '';
  playerbowlstat: any;
  playerbowling: any;
  errorApi1=false;
  errorApi2=false;
  constructor(private playerService: PlayerService,
    private route: ActivatedRoute,
    private router: Router) { }

    async ngOnInit() {
      if (this.viewMode) {
        this.message = 'Loading...';
        this.getplayerinfo(this.route.snapshot.params["id"]);
        this.getplayerstat(this.route.snapshot.params["id"]);
        this.getplayercareer(this.route.snapshot.params["id"]);
        this.getplayerbowling(this.route.snapshot.params["id"]);
        this.getplayerbowlstat(this.route.snapshot.params["id"]);
      }
    }
    async getplayerinfo(id: string) {
      console.log("Fetching data...")
      this.playerinfo = await lastValueFrom(this.playerService.getplayerinfo(id));
      this.playerinfo =this.playerinfo[0];
      console.log(this.playerinfo);
    }
    async getplayercareer(id: string) {
      console.log("Fetching data...")
      this.playercareer = await lastValueFrom(this.playerService.getplayercareer(id));
      this.errorApi1=this.playercareer == null ||  this.playercareer.length === 0;
      this.playercareer =this.playercareer[0];
      console.log(this.playercareer);
    }
    async getplayerbowling(id: string) {
      console.log("Fetching data...")
      this.playerbowling = await lastValueFrom(this.playerService.getplayerbowling(id));
      this.errorApi2=this.playerbowling == null ||  this.playerbowling.length === 0;
      console.log(this.errorApi2)
      console.log(this.playerbowling);
      this.playerbowling =this.playerbowling[0];
      if (this.playerbowling == null) {
        console.log("No data found");
      } 
      console.log(this.playerbowling);
      
    }
    
    async getplayerbowlstat(id: string) {
      console.log("Fetching data...")
      this.playerbowlstat = await lastValueFrom(this.playerService.getplayerbowlstat(id));
      var len = this.playerbowlstat.length;
      var matches1 = new Array(len);
      var runs1 = new Array<number>(len);
      var wicket_stat = new Array<number>(len);

      this.errorApi2=this.playerbowlstat == null ||  this.playerbowlstat.length === 0;

      this.playerbowlstat.forEach((element: any, i: number) => {
        matches1[i] = Number(element.match_id);
        runs1[i] = Number(element.runs_match);
        wicket_stat[i] = Number(element.wickets_match);
      });
      var player_bowlstat = new Chart("Player_bowling_Stat", {
          type: "bar",
          data: {
            labels: matches1,
            datasets:[
                {
                  backgroundColor: 'rgb(0, 150, 255)',
                  label: "Runs Scored", 
                  data : runs1,
                  barThickness: 50,
                  barPercentage: 0.5,
                  order: 1
                },
                {
                  fill: false,
                  label: 'Wickets',
                  data: wicket_stat,
                  backgroundColor: 'black', 
                  type: 'line',
                  borderColor: 'rgb(64, 224, 208)',
                  lineTension: 0,
                  order: 0
                }
            ]
          },
          options: {
              plugins: {
                  legend: {
                    position: 'top',
                      display: true,
                      labels: {
                          color: 'blue',label: "Runs more than 100"
                      }
                  }
              },
              scales: {

                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Match ID'
                    }
                  }],
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Runs Scored'
                    }
                  }]
              }
          }
          
        });
      console.log(this.playerbowlstat);
    }
    async getplayerstat(id: string)
    {
      this.playerstat = await lastValueFrom(this.playerService.getplayerstat(id));
      this.errorApi1=this.playerstat == null ||  this.playerstat.length === 0;
      var len = this.playerstat.length;
      var matches1 = new Array(len);
      var runs1 = new Array<number>(len);
      var wicket_stat = new Array<number>(len);
      var average1 = new Array<number>(len);  
      this.playerstat.forEach((element: any, i: number) => {
        matches1[i] = Number(element.match_id);
        runs1[i] = Number(element.runs);
        wicket_stat[i] = Number(element.wicket_stat);
        average1[i] = Number(element.average);
      });
      var color = getRandomColor(runs1,len);

      var play_stat = new Chart("Player_Stats", {
          type: "bar",
          data: {
            labels: matches1,
            datasets:[
                {
                  backgroundColor: color,
                  label: "Runs Scored", 
                  data : runs1,
                  barThickness: 50,
                  barPercentage: 0.5,
                  order: 1
                },
                {
                  fill: false,
                  label: 'Not Out',
                  data: runs1,
                  backgroundColor: 'yellow', 
                  pointStyle: 'star',
                  borderColor: 'rgba(91, 14, 214, 0.9)',
                  borderWidth: 3,
                  pointRadius: pointRadius1,
                  type: 'line',
                  showLine: false,
                  order: 0
                },
                {
                  fill: false,
                  label: 'Average',
                  data: average1,
                  backgroundColor: 'red', 
                  type: 'line',
                  borderColor: 'black',
                  lineTension: 0,
                  order: 0
                }
            ]
          },
          options: {
              plugins: {
                  legend: {
                    position: 'top',
                      display: true,
                      labels: {
                          color: 'blue',label: "Runs more than 100"
                      }
                  }
              },
              scales: {

                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Match ID'
                    }
                  }],
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Runs Scored'
                    }
                  }]
              }
          }
          
        });
        function pointRadius1(context: any)
        {
        let index = context.dataIndex;
        let value = 1;
        value = wicket_stat[index];
        return value<1 ? 10 : 0;
      }
    }
  
}

function getRandomColor(runs:Array<number>,len:number):string[] {
  var color = new Array<string>(len);
  for (var i = 0; i < len; i++ ) {
      if(runs[i]>=0 && runs[i]<20){
        color[i]='rgba(29, 236, 197, 0.7)';
      }
      else if(runs[i]>=20 && runs[i]<30){
        color[i]='rgb(100, 149, 237, 0.7)';
      }
      else if(runs[i]>=30 && runs[i]<=50){
        color[i]='rgb(204, 204, 255, 0.7)';
      }
      else if(runs[i]>50 ){
        color[i]='rgba(249, 253, 9, 0.7)';
      }
  }
  return color;
}