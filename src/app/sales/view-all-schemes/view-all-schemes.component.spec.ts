import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllSchemesComponent } from './view-all-schemes.component';

describe('ViewAllSchemesComponent', () => {
  let component: ViewAllSchemesComponent;
  let fixture: ComponentFixture<ViewAllSchemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllSchemesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
