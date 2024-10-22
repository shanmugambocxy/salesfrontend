import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewAllotmentComponent } from './list-view-allotment.component';

describe('ListViewAllotmentComponent', () => {
  let component: ListViewAllotmentComponent;
  let fixture: ComponentFixture<ListViewAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListViewAllotmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListViewAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
