import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftsaledeedGenerateComponent } from './draftsaledeed-generate.component';

describe('DraftsaledeedGenerateComponent', () => {
  let component: DraftsaledeedGenerateComponent;
  let fixture: ComponentFixture<DraftsaledeedGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftsaledeedGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DraftsaledeedGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
