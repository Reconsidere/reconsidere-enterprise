import { TestBed } from '@angular/core/testing';

import { MaterialSummary } from './material-summary.service';

describe('MaterialSummary', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialSummary = TestBed.get(MaterialSummary);
    expect(service).toBeTruthy();
  });
});
