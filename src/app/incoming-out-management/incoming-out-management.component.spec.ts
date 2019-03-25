import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingOutManagementComponent } from './incoming-out-management.component';

describe('IncomingOutManagementComponent', () => {
  let component: IncomingOutManagementComponent;
  let fixture: ComponentFixture<IncomingOutManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingOutManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingOutManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
