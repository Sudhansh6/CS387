import { TestBed } from '@angular/core/testing';

import { VenueDetailsService } from './venue-details.service';

describe('VenueDetailsService', () => {
  let service: VenueDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenueDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
