import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotteeChallanViewComponent } from './allottee-challan-view.component';

describe('AllotteeChallanViewComponent', () => {
  let component: AllotteeChallanViewComponent;
  let fixture: ComponentFixture<AllotteeChallanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotteeChallanViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllotteeChallanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
