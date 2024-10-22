import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NocUploadedComponent } from './noc-uploaded.component';

describe('NocUploadedComponent', () => {
  let component: NocUploadedComponent;
  let fixture: ComponentFixture<NocUploadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NocUploadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NocUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
