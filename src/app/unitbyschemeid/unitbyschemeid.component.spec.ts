import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitbyschemeidComponent } from './unitbyschemeid.component';

describe('UnitbyschemeidComponent', () => {
  let component: UnitbyschemeidComponent;
  let fixture: ComponentFixture<UnitbyschemeidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitbyschemeidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitbyschemeidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
