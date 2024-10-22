import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesLCSComponent } from './templates-lcs.component';

describe('TemplatesLCSComponent', () => {
  let component: TemplatesLCSComponent;
  let fixture: ComponentFixture<TemplatesLCSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesLCSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesLCSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
