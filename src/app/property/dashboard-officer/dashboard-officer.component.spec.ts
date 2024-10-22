import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOfficerComponent } from './dashboard-officer.component';

describe('DashboardOfficerComponent', () => {
  let component: DashboardOfficerComponent;
  let fixture: ComponentFixture<DashboardOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOfficerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
