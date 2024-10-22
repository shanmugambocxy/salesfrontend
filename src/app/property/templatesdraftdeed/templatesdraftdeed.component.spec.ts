import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesdraftdeedComponent } from './templatesdraftdeed.component';

describe('TemplatesdraftdeedComponent', () => {
  let component: TemplatesdraftdeedComponent;
  let fixture: ComponentFixture<TemplatesdraftdeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesdraftdeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesdraftdeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
