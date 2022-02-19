import { Component, Input,  OnInit } from '@angular/core';
import { VenueDetailsService } from 'src/app/services/venue-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.scss']
})
export class VenueListComponent implements OnInit {
  venues: any;
  count=0;
  currentIndex = -1;
  page = 1;
  title = '';
  constructor(private router: Router, private venueService: VenueDetailsService) { }

  ngOnInit(): void {
    this.page = 1;
    this.count = 0;
    this.retrieveVenues();
  }
  async retrieveVenues(){
    this.venues = await lastValueFrom(this.venueService.getAllvenue());
    this.count = this.venues.length;
    console.log(this.count);
    console.log(this.venues);
  }
  redirectVenue(index: number): void {
    this.router.navigate([`/venue/${index}`]);
  }
  refreshList(): void {
    this.retrieveVenues();
    this.currentIndex = -1;
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.refreshList();
  }
}
