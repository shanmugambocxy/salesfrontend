import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeViewApplicationComponent } from './employee-view-application.component';

describe('EmployeeViewApplicationComponent', () => {
  let component: EmployeeViewApplicationComponent;
  let fixture: ComponentFixture<EmployeeViewApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeViewApplicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeViewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
