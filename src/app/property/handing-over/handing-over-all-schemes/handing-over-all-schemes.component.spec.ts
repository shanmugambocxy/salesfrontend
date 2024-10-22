import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandingOverAllSchemesComponent } from './handing-over-all-schemes.component';

describe('HandingOverAllSchemesComponent', () => {
  let component: HandingOverAllSchemesComponent;
  let fixture: ComponentFixture<HandingOverAllSchemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandingOverAllSchemesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandingOverAllSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
