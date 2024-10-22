import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateshandingoverComponent } from './templateshandingover.component';

describe('TemplateshandingoverComponent', () => {
  let component: TemplateshandingoverComponent;
  let fixture: ComponentFixture<TemplateshandingoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateshandingoverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateshandingoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
