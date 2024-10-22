import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllotmentComponent } from './view-allotment.component';

describe('ViewAllotmentComponent', () => {
  let component: ViewAllotmentComponent;
  let fixture: ComponentFixture<ViewAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllotmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
