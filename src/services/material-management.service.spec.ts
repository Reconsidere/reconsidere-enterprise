import { TestBed } from '@angular/core/testing';

import { MaterialManagementService } from './material-management.service';

describe('MaterialManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialManagementService = TestBed.get(MaterialManagementService);
    expect(service).toBeTruthy();
  });
});
