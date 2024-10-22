import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewUnitsComponent } from './list-view-units.component';

describe('ListViewUnitsComponent', () => {
  let component: ListViewUnitsComponent;
  let fixture: ComponentFixture<ListViewUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListViewUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListViewUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
