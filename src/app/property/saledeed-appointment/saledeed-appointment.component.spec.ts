import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaledeedAppointmentComponent } from './saledeed-appointment.component';

describe('SaledeedAppointmentComponent', () => {
  let component: SaledeedAppointmentComponent;
  let fixture: ComponentFixture<SaledeedAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaledeedAppointmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaledeedAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
