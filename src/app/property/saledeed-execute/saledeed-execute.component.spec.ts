import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaledeedExecuteComponent } from './saledeed-execute.component';

describe('SaledeedExecuteComponent', () => {
  let component: SaledeedExecuteComponent;
  let fixture: ComponentFixture<SaledeedExecuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaledeedExecuteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaledeedExecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
