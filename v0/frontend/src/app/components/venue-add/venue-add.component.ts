import { Component, OnInit } from '@angular/core';
import { VenueDetailsService } from 'src/app/services/venue-details.service';

@Component({
  selector: 'app-venue-add',
  templateUrl: './venue-add.component.html',
  styleUrls: ['./venue-add.component.scss']
})

export class VenueAddComponent implements OnInit {
  venue = {
    venue_name: '',
    city_name: '',
    country_name: '',
    capacity: 0
  };

  submitted = false;
  constructor(private venueAddService: VenueDetailsService) { }
  
  ngOnInit(): void {
  }

  saveVenue(): void {
    const data = 
    {
      "venue_name": this.venue.venue_name,
      "city_name": this.venue.city_name,
      "country_name": this.venue.country_name,
      "capacity": this.venue.capacity
    };

    this.venueAddService.create(data)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.submitted = true;
      },
      error: (e) => console.error(e)
    });  
  }
  
  newVenue(): void {
    this.submitted = false;
    this.venue = {
      venue_name: '',
      city_name: '',
      country_name: '',
      capacity: 0
    };
  }
}
