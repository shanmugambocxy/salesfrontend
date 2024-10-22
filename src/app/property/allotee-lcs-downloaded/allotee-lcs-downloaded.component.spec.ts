import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeLCSDownloadedComponent } from './allotee-lcs-downloaded.component';

describe('AlloteeLCSDownloadedComponent', () => {
  let component: AlloteeLCSDownloadedComponent;
  let fixture: ComponentFixture<AlloteeLCSDownloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeLCSDownloadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeLCSDownloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
