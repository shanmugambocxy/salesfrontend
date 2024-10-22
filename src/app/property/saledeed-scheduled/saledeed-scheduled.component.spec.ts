import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaledeedScheduledComponent } from './saledeed-scheduled.component';

describe('SaledeedScheduledComponent', () => {
  let component: SaledeedScheduledComponent;
  let fixture: ComponentFixture<SaledeedScheduledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaledeedScheduledComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaledeedScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
