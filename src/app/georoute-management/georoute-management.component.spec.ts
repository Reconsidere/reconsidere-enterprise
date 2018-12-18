import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeorouteManagementComponent } from './georoute-management.component';

describe('GeorouteManagementComponent', () => {
  let component: GeorouteManagementComponent;
  let fixture: ComponentFixture<GeorouteManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeorouteManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeorouteManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
