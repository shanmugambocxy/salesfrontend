import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReceiptComponent } from './customer-receipt.component';

describe('CustomerReceiptComponent', () => {
  let component: CustomerReceiptComponent;
  let fixture: ComponentFixture<CustomerReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerReceiptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
