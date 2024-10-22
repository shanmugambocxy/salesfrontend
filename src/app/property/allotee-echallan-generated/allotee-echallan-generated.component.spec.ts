import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeEchallanGeneratedComponent } from './allotee-echallan-generated.component';

describe('AlloteeEchallanGeneratedComponent', () => {
  let component: AlloteeEchallanGeneratedComponent;
  let fixture: ComponentFixture<AlloteeEchallanGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeEchallanGeneratedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeEchallanGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
