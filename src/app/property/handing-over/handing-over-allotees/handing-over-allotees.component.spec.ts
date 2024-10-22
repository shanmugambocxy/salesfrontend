import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandingOverAlloteesComponent } from './handing-over-allotees.component';

describe('HandingOverAlloteesComponent', () => {
  let component: HandingOverAlloteesComponent;
  let fixture: ComponentFixture<HandingOverAlloteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandingOverAlloteesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandingOverAlloteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
