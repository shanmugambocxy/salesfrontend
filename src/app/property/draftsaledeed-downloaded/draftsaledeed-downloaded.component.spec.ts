import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftsaledeedDownloadedComponent } from './draftsaledeed-downloaded.component';

describe('DraftsaledeedDownloadedComponent', () => {
  let component: DraftsaledeedDownloadedComponent;
  let fixture: ComponentFixture<DraftsaledeedDownloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftsaledeedDownloadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DraftsaledeedDownloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
