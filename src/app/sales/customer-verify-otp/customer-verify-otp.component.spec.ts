import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVerifyOtpComponent } from './customer-verify-otp.component';

describe('CustomerVerifyOtpComponent', () => {
  let component: CustomerVerifyOtpComponent;
  let fixture: ComponentFixture<CustomerVerifyOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerVerifyOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerVerifyOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
