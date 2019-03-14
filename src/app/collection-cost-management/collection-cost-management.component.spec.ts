import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCostManagementComponent } from './collection-cost-management.component';

describe('CollectionCostManagementComponent', () => {
  let component: CollectionCostManagementComponent;
  let fixture: ComponentFixture<CollectionCostManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionCostManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionCostManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
