import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitcodefeesComponent } from './unitcodefees.component';

describe('UnitcodefeesComponent', () => {
  let component: UnitcodefeesComponent;
  let fixture: ComponentFixture<UnitcodefeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitcodefeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitcodefeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
