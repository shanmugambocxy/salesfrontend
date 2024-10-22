import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandingOverViewAlloteeComponent } from './handing-over-view-allotee.component';

describe('HandingOverViewAlloteeComponent', () => {
  let component: HandingOverViewAlloteeComponent;
  let fixture: ComponentFixture<HandingOverViewAlloteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandingOverViewAlloteeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandingOverViewAlloteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
