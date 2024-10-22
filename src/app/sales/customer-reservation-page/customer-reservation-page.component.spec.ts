import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReservationPageComponent } from './customer-reservation-page.component';

describe('CustomerReservationPageComponent', () => {
  let component: CustomerReservationPageComponent;
  let fixture: ComponentFixture<CustomerReservationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerReservationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerReservationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
