import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerForgotPasswordComponent } from './officer-forgot-password.component';

describe('OfficerForgotPasswordComponent', () => {
  let component: OfficerForgotPasswordComponent;
  let fixture: ComponentFixture<OfficerForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerForgotPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfficerForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
