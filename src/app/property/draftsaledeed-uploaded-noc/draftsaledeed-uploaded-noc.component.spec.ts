import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftsaledeedUploadedNOCComponent } from './draftsaledeed-uploaded-noc.component';

describe('DraftsaledeedUploadedNOCComponent', () => {
  let component: DraftsaledeedUploadedNOCComponent;
  let fixture: ComponentFixture<DraftsaledeedUploadedNOCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftsaledeedUploadedNOCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DraftsaledeedUploadedNOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
