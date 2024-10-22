import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotteeEchallanGenerateComponent } from './allottee-echallan-generate.component';

describe('AllotteeEchallanGenerateComponent', () => {
  let component: AllotteeEchallanGenerateComponent;
  let fixture: ComponentFixture<AllotteeEchallanGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotteeEchallanGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllotteeEchallanGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
