import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewSchemesComponent } from './list-view-schemes.component';

describe('ListViewSchemesComponent', () => {
  let component: ListViewSchemesComponent;
  let fixture: ComponentFixture<ListViewSchemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListViewSchemesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListViewSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
