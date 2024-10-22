import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcsGeneratedComponent } from './lcs-generated.component';

describe('LcsGeneratedComponent', () => {
  let component: LcsGeneratedComponent;
  let fixture: ComponentFixture<LcsGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcsGeneratedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LcsGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
