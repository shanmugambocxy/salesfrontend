import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchallanClearedComponent } from './echallan-cleared.component';

describe('EchallanClearedComponent', () => {
  let component: EchallanClearedComponent;
  let fixture: ComponentFixture<EchallanClearedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchallanClearedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EchallanClearedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
