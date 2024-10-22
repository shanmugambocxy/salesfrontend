import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaledeedExecutedComponent } from './saledeed-executed.component';

describe('SaledeedExecutedComponent', () => {
  let component: SaledeedExecutedComponent;
  let fixture: ComponentFixture<SaledeedExecutedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaledeedExecutedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaledeedExecutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
