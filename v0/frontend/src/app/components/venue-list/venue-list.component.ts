import { Component, OnInit } from '@angular/core';
import { VenueDetailsService } from 'src/app/services/venue-details.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.scss']
})
export class VenueListComponent implements OnInit {
  venues: any;
  count=0;
  constructor(private router: Router, private venueService: VenueDetailsService) { }

  ngOnInit(): void {
    this.retrieveVenues();
  }
  retrieveVenues(): void {
    this.venueService.getAllvenue()
      .subscribe({
        next: (data) => {
          this.venues = data;
        },
        error: (e) => console.error(e)
      });
    this.count = this.venues.length;
  }
}
