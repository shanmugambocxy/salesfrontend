import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftsaledeedGeneratedComponent } from './draftsaledeed-generated.component';

describe('DraftsaledeedGeneratedComponent', () => {
  let component: DraftsaledeedGeneratedComponent;
  let fixture: ComponentFixture<DraftsaledeedGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftsaledeedGeneratedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DraftsaledeedGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
