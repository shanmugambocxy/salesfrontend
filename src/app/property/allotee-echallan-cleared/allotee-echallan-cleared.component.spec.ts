import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeEchallanClearedComponent } from './allotee-echallan-cleared.component';

describe('AlloteeEchallanClearedComponent', () => {
  let component: AlloteeEchallanClearedComponent;
  let fixture: ComponentFixture<AlloteeEchallanClearedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeEchallanClearedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeEchallanClearedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
