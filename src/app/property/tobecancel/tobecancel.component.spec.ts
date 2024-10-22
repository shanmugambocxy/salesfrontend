import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TobecancelComponent } from './tobecancel.component';

describe('TobecancelComponent', () => {
  let component: TobecancelComponent;
  let fixture: ComponentFixture<TobecancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TobecancelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TobecancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
