import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AandBcertificateGenerateComponent } from './aand-bcertificate-generate.component';

describe('AandBcertificateGenerateComponent', () => {
  let component: AandBcertificateGenerateComponent;
  let fixture: ComponentFixture<AandBcertificateGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AandBcertificateGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AandBcertificateGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
