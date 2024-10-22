import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeLCSUploadComponent } from './allotee-lcs-upload.component';

describe('AlloteeLCSUploadComponent', () => {
  let component: AlloteeLCSUploadComponent;
  let fixture: ComponentFixture<AlloteeLCSUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeLCSUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeLCSUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
