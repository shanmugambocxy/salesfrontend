import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcsDownloadedComponent } from './lcs-downloaded.component';

describe('LcsDownloadedComponent', () => {
  let component: LcsDownloadedComponent;
  let fixture: ComponentFixture<LcsDownloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcsDownloadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LcsDownloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
