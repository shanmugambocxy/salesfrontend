import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloteeLCSUploadPrincipleComponent } from './allotee-lcs-upload-principle.component';

describe('AlloteeLCSUploadPrincipleComponent', () => {
  let component: AlloteeLCSUploadPrincipleComponent;
  let fixture: ComponentFixture<AlloteeLCSUploadPrincipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlloteeLCSUploadPrincipleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlloteeLCSUploadPrincipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
