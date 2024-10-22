import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmeentpopupComponent } from './appointmeentpopup.component';

describe('AppointmeentpopupComponent', () => {
  let component: AppointmeentpopupComponent;
  let fixture: ComponentFixture<AppointmeentpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmeentpopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmeentpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
