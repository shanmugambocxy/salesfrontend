import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewSchemesAllotmentComponent } from './list-view-schemes-allotment.component';

describe('ListViewSchemesAllotmentComponent', () => {
  let component: ListViewSchemesAllotmentComponent;
  let fixture: ComponentFixture<ListViewSchemesAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListViewSchemesAllotmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListViewSchemesAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
