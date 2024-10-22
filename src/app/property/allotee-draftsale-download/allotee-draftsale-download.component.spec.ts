import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeDraftsaleDownloadComponent } from './allotee-draftsale-download.component';

describe('AlloteeDraftsaleDownloadComponent', () => {
  let component: AlloteeDraftsaleDownloadComponent;
  let fixture: ComponentFixture<AlloteeDraftsaleDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeDraftsaleDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeDraftsaleDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
