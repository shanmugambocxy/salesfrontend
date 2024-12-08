import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaledeedTobeIssuedComponent } from './saledeed-tobe-issued.component';

describe('SaledeedTobeIssuedComponent', () => {
  let component: SaledeedTobeIssuedComponent;
  let fixture: ComponentFixture<SaledeedTobeIssuedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaledeedTobeIssuedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaledeedTobeIssuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
