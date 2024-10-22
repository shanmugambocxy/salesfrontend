import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeHandoverComponent } from './allotee-handover.component';

describe('AlloteeHandoverComponent', () => {
  let component: AlloteeHandoverComponent;
  let fixture: ComponentFixture<AlloteeHandoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeHandoverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeHandoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
