import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcsApproveComponent } from './lcs-approve.component';

describe('LcsApproveComponent', () => {
  let component: LcsApproveComponent;
  let fixture: ComponentFixture<LcsApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcsApproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LcsApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
