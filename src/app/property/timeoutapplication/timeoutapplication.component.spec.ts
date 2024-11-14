import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutapplicationComponent } from './timeoutapplication.component';

describe('TimeoutapplicationComponent', () => {
  let component: TimeoutapplicationComponent;
  let fixture: ComponentFixture<TimeoutapplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeoutapplicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeoutapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
