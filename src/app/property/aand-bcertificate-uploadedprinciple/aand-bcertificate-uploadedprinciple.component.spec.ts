import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AandBcertificateUploadedprincipleComponent } from './aand-bcertificate-uploadedprinciple.component';

describe('AandBcertificateUploadedprincipleComponent', () => {
  let component: AandBcertificateUploadedprincipleComponent;
  let fixture: ComponentFixture<AandBcertificateUploadedprincipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AandBcertificateUploadedprincipleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AandBcertificateUploadedprincipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
