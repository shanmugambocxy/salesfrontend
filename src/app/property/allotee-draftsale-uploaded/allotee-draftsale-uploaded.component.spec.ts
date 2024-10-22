import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeDraftsaleUploadedComponent } from './allotee-draftsale-uploaded.component';

describe('AlloteeDraftsaleUploadedComponent', () => {
  let component: AlloteeDraftsaleUploadedComponent;
  let fixture: ComponentFixture<AlloteeDraftsaleUploadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeDraftsaleUploadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeDraftsaleUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
