import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AandBcertificateGeneratedComponent } from './aand-bcertificate-generated.component';

describe('AandBcertificateGeneratedComponent', () => {
  let component: AandBcertificateGeneratedComponent;
  let fixture: ComponentFixture<AandBcertificateGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AandBcertificateGeneratedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AandBcertificateGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
