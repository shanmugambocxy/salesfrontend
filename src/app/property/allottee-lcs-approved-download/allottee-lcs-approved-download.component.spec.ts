import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotteeLcsApprovedDownloadComponent } from './allottee-lcs-approved-download.component';

describe('AllotteeLcsApprovedDownloadComponent', () => {
  let component: AllotteeLcsApprovedDownloadComponent;
  let fixture: ComponentFixture<AllotteeLcsApprovedDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotteeLcsApprovedDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllotteeLcsApprovedDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
