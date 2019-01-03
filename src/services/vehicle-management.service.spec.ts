import { TestBed } from '@angular/core/testing';

import { VehicleManagementService } from './vehicle-management.service';

describe('VehicleManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehicleManagementService = TestBed.get(VehicleManagementService);
    expect(service).toBeTruthy();
  });
});
