import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddViewEditSchemeComponent } from './add-view-edit-scheme.component';

describe('AddViewEditSchemeComponent', () => {
  let component: AddViewEditSchemeComponent;
  let fixture: ComponentFixture<AddViewEditSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddViewEditSchemeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddViewEditSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
