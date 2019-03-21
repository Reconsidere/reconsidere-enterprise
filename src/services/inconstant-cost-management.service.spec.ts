import { TestBed } from '@angular/core/testing';

import { InconstantCostManagementService } from './inconstant-cost-management.service';

describe('InconstantCostManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InconstantCostManagementService = TestBed.get(InconstantCostManagementService);
    expect(service).toBeTruthy();
  });
});
