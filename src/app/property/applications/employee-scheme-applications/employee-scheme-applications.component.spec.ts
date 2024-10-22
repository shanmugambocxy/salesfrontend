import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSchemeApplicationsComponent } from './employee-scheme-applications.component';

describe('EmployeeSchemeApplicationsComponent', () => {
  let component: EmployeeSchemeApplicationsComponent;
  let fixture: ComponentFixture<EmployeeSchemeApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSchemeApplicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeSchemeApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
