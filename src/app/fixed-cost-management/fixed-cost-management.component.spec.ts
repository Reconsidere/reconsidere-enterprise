import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedCostManagementComponent } from './fixed-cost-management.component';

describe('FixedCostManagementComponent', () => {
  let component: FixedCostManagementComponent;
  let fixture: ComponentFixture<FixedCostManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedCostManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedCostManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
