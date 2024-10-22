import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentorderDownloadedComponent } from './allotmentorder-downloaded.component';

describe('AllotmentorderDownloadedComponent', () => {
  let component: AllotmentorderDownloadedComponent;
  let fixture: ComponentFixture<AllotmentorderDownloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotmentorderDownloadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllotmentorderDownloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
