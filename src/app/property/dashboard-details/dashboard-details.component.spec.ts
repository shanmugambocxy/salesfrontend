import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDetailsComponent } from './dashboard-details.component';

describe('DashboardDetailsComponent', () => {
  let component: DashboardDetailsComponent;
  let fixture: ComponentFixture<DashboardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
