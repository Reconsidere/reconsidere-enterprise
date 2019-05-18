import { TestBed } from '@angular/core/testing';

import { NeighborhoodSchedulingService } from './neighborhood-scheduling.service';

describe('NeighborhoodSchedulingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeighborhoodSchedulingService = TestBed.get(NeighborhoodSchedulingService);
    expect(service).toBeTruthy();
  });
});
