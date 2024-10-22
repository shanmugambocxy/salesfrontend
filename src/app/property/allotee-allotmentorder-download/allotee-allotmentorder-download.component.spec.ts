import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeAllotmentorderDownloadComponent } from './allotee-allotmentorder-download.component';

describe('AlloteeAllotmentorderDownloadComponent', () => {
  let component: AlloteeAllotmentorderDownloadComponent;
  let fixture: ComponentFixture<AlloteeAllotmentorderDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeAllotmentorderDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeAllotmentorderDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
