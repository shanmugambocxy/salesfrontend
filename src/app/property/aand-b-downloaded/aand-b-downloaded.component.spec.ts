import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AandBDownloadedComponent } from './aand-b-downloaded.component';

describe('AandBDownloadedComponent', () => {
  let component: AandBDownloadedComponent;
  let fixture: ComponentFixture<AandBDownloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AandBDownloadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AandBDownloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
