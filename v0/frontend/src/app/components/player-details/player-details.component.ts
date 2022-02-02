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
  message = '';

  constructor(private playerService: PlayerService,
    private route: ActivatedRoute,
    private router: Router) { }

    async ngOnInit() {
      if (this.viewMode) {
        this.message = 'Loading...';
        this.getplayerinfo(this.route.snapshot.params["id"]);
        this.getplayerstat(this.route.snapshot.params["id"]);
      }
    }
    async getplayerinfo(id: string) {
      console.log("Fetching data...")
      this.playerinfo = await lastValueFrom(this.playerService.getplayerinfo(id));
      this.playerinfo =this.playerinfo[0];
      console.log(this.playerinfo);
    }
    async getplayerstat(id: string)
    {
      this.playerstat = await lastValueFrom(this.playerService.getplayerstat(id));
  
      var len = this.playerstat.length;
      var matches1 = new Array(len);
      var runs1 = new Array<number>(len);
      
      this.playerstat.forEach((element: any, i: number) => {
        matches1[i] = Number(element.match_id);
        runs1[i] = Number(element.runs);
      });
      var color = getRandomColor(runs1,len);

      var play_stat = new Chart("Player_Stats", {
          type: "bar",
          data: {
            labels: matches1,
            datasets:[
              {backgroundColor: color,
                label: "Runs Scored", data : runs1}
            ]
          },
          options: {
              plugins: {
                  legend: {
                    position: "left",
                      display: true,
                      labels: {
                          color: 'blue',label: "Runs more than 100"
                      }
                  }
              }
          }
          
        });
    }
    
}
function getRandomColor(runs:Array<number>,len:number):string[] {
  var color = new Array<string>(len);
  for (var i = 0; i < len; i++ ) {
      if(runs[i]>=0 && runs[i]<=20){
        color[i]='green';
      }
      else if(runs[i]>=21 && runs[i]<=30){
        color[i]='red';
      }
      else if(runs[i]>=31 && runs[i]<=50){
        color[i]='blue';
      }
      else if(runs[i]>=51 ){
        color[i]='yellow';
      }
  }
  return color;
}