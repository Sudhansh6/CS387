import { Component,Input, OnInit,Inject } from '@angular/core';
import { VenueDetailsService } from 'src/app/services/venue-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Chart } from 'chart.js';
import { DOCUMENT } from '@angular/common'; 
@Component({
  selector: 'app-venue-details',
  templateUrl: './venue-details.component.html',
  styleUrls: ['./venue-details.component.scss']
})
export class VenueDetailsComponent implements OnInit {
  @Input() viewMode = true;
  message = '';
  venueinfo: any;
  tempvenueinfo: any;
  new_venue=false;
  highscore= 0;
  constructor(private venueService: VenueDetailsService,
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    if (this.viewMode) {
      this.message = 'Loading...';
      this.getvenueinfo(this.route.snapshot.params["id"]);
      this.matchoutline(this.route.snapshot.params["id"]);
      this.displayavgscore(this.route.snapshot.params["id"]);
    }
  }
  async displayavgscore(id: string) {
    var res1 = await lastValueFrom(this.venueService.getavgfirstscore(id));
    
    var data1 = new Array();
    let map = new Map();
    map.set(2011,0)
    map.set(2013,0)
    map.set(2015,0)
    map.set(2017,0)
    var year_list = new Array();
    year_list=[2011,2013,2015,2017];
    for (var i in res1)
    {
      map.set(res1[i].season_year,res1[i].avg_runs);
      

    }
    for(var i in year_list){
      data1.push(map.get(year_list[i]));
    }
    console.log(map);
new Chart('NewChart', {
    type: 'line',    
    data: {
      labels: year_list,
      datasets: [{
        fill: false,
        lineTension: 0,
        data: data1,
        backgroundColor: 'rgb(63, 0, 255)',
        borderColor: 'rgb(137, 207, 240,0.7)',
        label: this.venueinfo.venue_name,
      }]
    }
});
  }
  async matchoutline(id: string){
    var res1 = await lastValueFrom(this.venueService.getmatchoutline(id));
    
    var labels1 = new Array();
    var data1 = new Array();
    var colors1 = [];
    
    for (var i in res1[0])
    {
      labels1.push(i);
      data1.push(res1[0][i]);
      colors1.push('#' + Math.floor(res1[0][i]*1687.7215).toString(16));
    }
    data1[2]=data1[2]-data1[1]-data1[0];
    labels1[0]="Team batting 1st won";
    labels1[1]="Team batting 2nd won";
    labels1[2]="Draw";
    colors1=['#FF0000','#00FF00','#0000FF'];
new Chart('PieChart', {
    type: 'doughnut',    
    data: {
      labels: labels1,
      datasets: [{
        data: data1,
        backgroundColor: colors1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: [ 'white', 'red'],
          precision: 2
        }
      },
    }
});
  }
  async getvenueinfo(id: string) {
    console.log("Fetching data...")
    this.venueinfo = await lastValueFrom(this.venueService.getvenueinfo(id));
    if (this.venueinfo.length == 0) {
      this.new_venue=true;
      this.message = 'No data found';
      console.log("No data found")
      this.tempvenueinfo = await lastValueFrom(this.venueService.gettempvenueinfo(id));
      this.tempvenueinfo = this.tempvenueinfo[0];
      console.log(this.tempvenueinfo);
    }
    this.venueinfo =this.venueinfo[0];
    this.highscore = (await lastValueFrom(this.venueService.gethighscore(id)))[0].highscore_chased;
    console.log(this.venueinfo);
  }
}
