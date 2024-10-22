import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarparkingGeneratedComponent } from './carparking-generated.component';

describe('CarparkingGeneratedComponent', () => {
  let component: CarparkingGeneratedComponent;
  let fixture: ComponentFixture<CarparkingGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarparkingGeneratedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarparkingGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
