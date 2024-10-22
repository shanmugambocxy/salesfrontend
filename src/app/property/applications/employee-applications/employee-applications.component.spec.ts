import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeApplicationsComponent } from './employee-applications.component';

describe('EmployeeApplicationsComponent', () => {
  let component: EmployeeApplicationsComponent;
  let fixture: ComponentFixture<EmployeeApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeApplicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
