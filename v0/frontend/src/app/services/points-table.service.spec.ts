import { TestBed } from '@angular/core/testing';

import { PointsTableService } from './points-table.service';

describe('PointsTableService', () => {
  let service: PointsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointsTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
