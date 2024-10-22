import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftsaledeedUploadNOCComponent } from './draftsaledeed-upload-noc.component';

describe('DraftsaledeedUploadNOCComponent', () => {
  let component: DraftsaledeedUploadNOCComponent;
  let fixture: ComponentFixture<DraftsaledeedUploadNOCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftsaledeedUploadNOCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DraftsaledeedUploadNOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
