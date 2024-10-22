import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateofinterestComponent } from './rateofinterest.component';

describe('RateofinterestComponent', () => {
  let component: RateofinterestComponent;
  let fixture: ComponentFixture<RateofinterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateofinterestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RateofinterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
