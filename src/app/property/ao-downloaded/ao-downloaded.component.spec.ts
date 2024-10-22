import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AoDownloadedComponent } from './ao-downloaded.component';

describe('AoDownloadedComponent', () => {
  let component: AoDownloadedComponent;
  let fixture: ComponentFixture<AoDownloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AoDownloadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AoDownloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
