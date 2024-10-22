import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllUnsoldComponent } from './view-all-unsold.component';

describe('ViewAllUnsoldComponent', () => {
  let component: ViewAllUnsoldComponent;
  let fixture: ComponentFixture<ViewAllUnsoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllUnsoldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllUnsoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
