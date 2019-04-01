import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialSummaryComponent } from './material-summary.component';

describe('PricingComponent', () => {
  let component: MaterialSummaryComponent;
  let fixture: ComponentFixture<MaterialSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
