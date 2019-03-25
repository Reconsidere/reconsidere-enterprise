import { TestBed } from '@angular/core/testing';

import { IncomingOutManagementService } from './incoming-out-management.service';

describe('IncomingOutManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncomingOutManagementService = TestBed.get(IncomingOutManagementService);
    expect(service).toBeTruthy();
  });
});
