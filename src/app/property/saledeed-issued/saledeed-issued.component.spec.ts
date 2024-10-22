import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaledeedIssuedComponent } from './saledeed-issued.component';

describe('SaledeedIssuedComponent', () => {
  let component: SaledeedIssuedComponent;
  let fixture: ComponentFixture<SaledeedIssuedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaledeedIssuedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaledeedIssuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
