import { TestBed } from '@angular/core/testing';

import { CollectionCostManagementService } from './collection-cost-management.service';

describe('CollectionCostManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollectionCostManagementService = TestBed.get(CollectionCostManagementService);
    expect(service).toBeTruthy();
  });
});
