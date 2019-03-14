import { TestBed } from '@angular/core/testing';

import { ProcessingChainManagementService } from './processing-chain-management.service';

describe('ProcessingChainManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessingChainManagementService = TestBed.get(ProcessingChainManagementService);
    expect(service).toBeTruthy();
  });
});
