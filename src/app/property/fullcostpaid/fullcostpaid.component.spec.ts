import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullcostpaidComponent } from './fullcostpaid.component';

describe('FullcostpaidComponent', () => {
  let component: FullcostpaidComponent;
  let fixture: ComponentFixture<FullcostpaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullcostpaidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullcostpaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
