import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMediaComponent } from './scheme-media.component';

describe('SchemeMediaComponent', () => {
  let component: SchemeMediaComponent;
  let fixture: ComponentFixture<SchemeMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeMediaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchemeMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
