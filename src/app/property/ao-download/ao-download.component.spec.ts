import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AoDownloadComponent } from './ao-download.component';

describe('AoDownloadComponent', () => {
  let component: AoDownloadComponent;
  let fixture: ComponentFixture<AoDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AoDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AoDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
