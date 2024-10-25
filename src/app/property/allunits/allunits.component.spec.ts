import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllunitsComponent } from './allunits.component';

describe('AllunitsComponent', () => {
  let component: AllunitsComponent;
  let fixture: ComponentFixture<AllunitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllunitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllunitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
