import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotteeAandbDownloadComponent } from './allottee-aandb-download.component';

describe('AllotteeAandbDownloadComponent', () => {
  let component: AllotteeAandbDownloadComponent;
  let fixture: ComponentFixture<AllotteeAandbDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotteeAandbDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllotteeAandbDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
