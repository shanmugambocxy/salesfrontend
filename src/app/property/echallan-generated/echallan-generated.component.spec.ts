import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchallanGeneratedComponent } from './echallan-generated.component';

describe('EchallanGeneratedComponent', () => {
  let component: EchallanGeneratedComponent;
  let fixture: ComponentFixture<EchallanGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchallanGeneratedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EchallanGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
