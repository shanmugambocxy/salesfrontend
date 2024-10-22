import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeApplicationComponent } from './allotee-application.component';

describe('AlloteeApplicationComponent', () => {
  let component: AlloteeApplicationComponent;
  let fixture: ComponentFixture<AlloteeApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeApplicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
