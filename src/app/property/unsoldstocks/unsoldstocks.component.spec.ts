import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsoldstocksComponent } from './unsoldstocks.component';

describe('UnsoldstocksComponent', () => {
  let component: UnsoldstocksComponent;
  let fixture: ComponentFixture<UnsoldstocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsoldstocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnsoldstocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
