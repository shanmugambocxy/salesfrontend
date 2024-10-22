import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationSaleslistComponent } from './reservation-saleslist.component';

describe('ReservationSaleslistComponent', () => {
  let component: ReservationSaleslistComponent;
  let fixture: ComponentFixture<ReservationSaleslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationSaleslistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationSaleslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
