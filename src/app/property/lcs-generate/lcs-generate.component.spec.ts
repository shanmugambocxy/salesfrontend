import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcsGenerateComponent } from './lcs-generate.component';

describe('LcsGenerateComponent', () => {
  let component: LcsGenerateComponent;
  let fixture: ComponentFixture<LcsGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcsGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LcsGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
