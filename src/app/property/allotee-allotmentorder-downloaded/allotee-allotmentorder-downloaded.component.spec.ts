import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeAllotmentorderDownloadedComponent } from './allotee-allotmentorder-downloaded.component';

describe('AlloteeAllotmentorderDownloadedComponent', () => {
  let component: AlloteeAllotmentorderDownloadedComponent;
  let fixture: ComponentFixture<AlloteeAllotmentorderDownloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeAllotmentorderDownloadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeAllotmentorderDownloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
