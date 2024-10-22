import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeDraftsaleUploadComponent } from './allotee-draftsale-upload.component';

describe('AlloteeDraftsaleUploadComponent', () => {
  let component: AlloteeDraftsaleUploadComponent;
  let fixture: ComponentFixture<AlloteeDraftsaleUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeDraftsaleUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeDraftsaleUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
