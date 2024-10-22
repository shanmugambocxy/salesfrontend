import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarparkingGenerateComponent } from './carparking-generate.component';

describe('CarparkingGenerateComponent', () => {
  let component: CarparkingGenerateComponent;
  let fixture: ComponentFixture<CarparkingGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarparkingGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarparkingGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
