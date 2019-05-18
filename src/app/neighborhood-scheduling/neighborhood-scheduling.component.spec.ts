import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodSchedulingComponent } from './neighborhood-scheduling.component';

describe('NeighborhoodSchedulingComponent', () => {
  let component: NeighborhoodSchedulingComponent;
  let fixture: ComponentFixture<NeighborhoodSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeighborhoodSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborhoodSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
