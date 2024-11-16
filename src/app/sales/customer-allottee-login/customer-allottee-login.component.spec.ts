import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAllotteeLoginComponent } from './customer-allottee-login.component';

describe('CustomerAllotteeLoginComponent', () => {
  let component: CustomerAllotteeLoginComponent;
  let fixture: ComponentFixture<CustomerAllotteeLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAllotteeLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerAllotteeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
