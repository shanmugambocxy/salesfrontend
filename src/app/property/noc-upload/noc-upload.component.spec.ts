import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NocUploadComponent } from './noc-upload.component';

describe('NocUploadComponent', () => {
  let component: NocUploadComponent;
  let fixture: ComponentFixture<NocUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NocUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NocUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
