import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrunityfeesComponent } from './scrunityfees.component';

describe('ScrunityfeesComponent', () => {
  let component: ScrunityfeesComponent;
  let fixture: ComponentFixture<ScrunityfeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrunityfeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScrunityfeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
