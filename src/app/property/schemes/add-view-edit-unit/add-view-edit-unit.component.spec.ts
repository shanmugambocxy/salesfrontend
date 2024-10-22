import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddViewEditUnitComponent } from './add-view-edit-unit.component';

describe('AddViewEditUnitComponent', () => {
  let component: AddViewEditUnitComponent;
  let fixture: ComponentFixture<AddViewEditUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddViewEditUnitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddViewEditUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
