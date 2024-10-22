import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeSaledeedScheduleComponent } from './allotee-saledeed-schedule.component';

describe('AlloteeSaledeedScheduleComponent', () => {
  let component: AlloteeSaledeedScheduleComponent;
  let fixture: ComponentFixture<AlloteeSaledeedScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeSaledeedScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeSaledeedScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
