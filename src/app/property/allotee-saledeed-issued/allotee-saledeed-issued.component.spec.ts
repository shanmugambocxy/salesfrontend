import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeSaledeedIssuedComponent } from './allotee-saledeed-issued.component';

describe('AlloteeSaledeedIssuedComponent', () => {
  let component: AlloteeSaledeedIssuedComponent;
  let fixture: ComponentFixture<AlloteeSaledeedIssuedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeSaledeedIssuedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeSaledeedIssuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
