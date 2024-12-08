import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullcostnotpaidComponent } from './fullcostnotpaid.component';

describe('FullcostnotpaidComponent', () => {
  let component: FullcostnotpaidComponent;
  let fixture: ComponentFixture<FullcostnotpaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullcostnotpaidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullcostnotpaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
