import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InconstantCostManagementComponent } from './inconstant-cost-management.component';

describe('InconstantCostManagementComponent', () => {
  let component: InconstantCostManagementComponent;
  let fixture: ComponentFixture<InconstantCostManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InconstantCostManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InconstantCostManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
