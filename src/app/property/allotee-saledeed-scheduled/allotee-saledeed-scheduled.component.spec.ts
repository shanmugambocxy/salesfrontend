import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeSaledeedScheduledComponent } from './allotee-saledeed-scheduled.component';

describe('AlloteeSaledeedScheduledComponent', () => {
  let component: AlloteeSaledeedScheduledComponent;
  let fixture: ComponentFixture<AlloteeSaledeedScheduledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeSaledeedScheduledComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeSaledeedScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
