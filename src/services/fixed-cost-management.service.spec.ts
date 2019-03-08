import { TestBed } from '@angular/core/testing';

import { FixedCostManagementService } from './fixed-cost-management.service';

describe('FixedCostManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FixedCostManagementService = TestBed.get(FixedCostManagementService);
    expect(service).toBeTruthy();
  });
});
