import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcsApprovedComponent } from './lcs-approved.component';

describe('LcsApprovedComponent', () => {
  let component: LcsApprovedComponent;
  let fixture: ComponentFixture<LcsApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcsApprovedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LcsApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
