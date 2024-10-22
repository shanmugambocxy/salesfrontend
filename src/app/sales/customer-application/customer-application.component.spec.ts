import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerApplicationComponent } from './customer-application.component';

describe('CustomerApplicationComponent', () => {
  let component: CustomerApplicationComponent;
  let fixture: ComponentFixture<CustomerApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerApplicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
