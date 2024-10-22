import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcsUploadedComponent } from './lcs-uploaded.component';

describe('LcsUploadedComponent', () => {
  let component: LcsUploadedComponent;
  let fixture: ComponentFixture<LcsUploadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcsUploadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LcsUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
