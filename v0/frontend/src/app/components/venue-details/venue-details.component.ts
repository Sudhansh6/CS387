import { Component,Input, OnInit } from '@angular/core';
import { VenueDetailsService } from 'src/app/services/venue-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Chart } from 'chart.js';

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
  constructor(private venueService: VenueDetailsService,
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    if (this.viewMode) {
      this.message = 'Loading...';
      this.getvenueinfo(this.route.snapshot.params["id"]);
    }
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
    console.log(this.venueinfo);
  }
}
