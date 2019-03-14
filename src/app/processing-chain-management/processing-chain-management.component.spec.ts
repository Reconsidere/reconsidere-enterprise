import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingChainManagementComponent } from './processing-chain-management.component';

describe('ProcessingChainManagementComponent', () => {
  let component: ProcessingChainManagementComponent;
  let fixture: ComponentFixture<ProcessingChainManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingChainManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingChainManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
