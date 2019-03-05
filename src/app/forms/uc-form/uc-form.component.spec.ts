import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcFormComponent } from './uc-form.component';

describe('UcFormComponent', () => {
  let component: UcFormComponent;
  let fixture: ComponentFixture<UcFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
