import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentorderComponent } from './allotmentorder.component';

describe('AllotmentorderComponent', () => {
  let component: AllotmentorderComponent;
  let fixture: ComponentFixture<AllotmentorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotmentorderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllotmentorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
