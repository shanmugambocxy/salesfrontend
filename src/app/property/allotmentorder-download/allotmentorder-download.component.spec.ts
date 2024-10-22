import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentorderDownloadComponent } from './allotmentorder-download.component';

describe('AllotmentorderDownloadComponent', () => {
  let component: AllotmentorderDownloadComponent;
  let fixture: ComponentFixture<AllotmentorderDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotmentorderDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllotmentorderDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
