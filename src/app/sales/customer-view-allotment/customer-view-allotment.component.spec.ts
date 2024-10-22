import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerViewAllotmentComponent } from './customer-view-allotment.component';

describe('CustomerViewAllotmentComponent', () => {
  let component: CustomerViewAllotmentComponent;
  let fixture: ComponentFixture<CustomerViewAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerViewAllotmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerViewAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
