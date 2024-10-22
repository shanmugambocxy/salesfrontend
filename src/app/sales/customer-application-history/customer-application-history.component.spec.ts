import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerApplicationHistoryComponent } from './customer-application-history.component';

describe('CustomerApplicationHistoryComponent', () => {
  let component: CustomerApplicationHistoryComponent;
  let fixture: ComponentFixture<CustomerApplicationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerApplicationHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerApplicationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
