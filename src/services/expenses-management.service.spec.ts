import { TestBed } from '@angular/core/testing';

import { ExpensesManagementService } from './expenses-management.service';

describe('ExpensesManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpensesManagementService = TestBed.get(ExpensesManagementService);
    expect(service).toBeTruthy();
  });
});
