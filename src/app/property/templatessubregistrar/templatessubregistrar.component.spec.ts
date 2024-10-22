import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatessubregistrarComponent } from './templatessubregistrar.component';

describe('TemplatessubregistrarComponent', () => {
  let component: TemplatessubregistrarComponent;
  let fixture: ComponentFixture<TemplatessubregistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatessubregistrarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatessubregistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
