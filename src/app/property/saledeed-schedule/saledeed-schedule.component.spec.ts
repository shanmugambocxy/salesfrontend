import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaledeedScheduleComponent } from './saledeed-schedule.component';

describe('SaledeedScheduleComponent', () => {
  let component: SaledeedScheduleComponent;
  let fixture: ComponentFixture<SaledeedScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaledeedScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaledeedScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
