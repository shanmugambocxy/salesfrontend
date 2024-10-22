import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSchemeComponent } from './view-scheme.component';

describe('ViewSchemeComponent', () => {
  let component: ViewSchemeComponent;
  let fixture: ComponentFixture<ViewSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSchemeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
