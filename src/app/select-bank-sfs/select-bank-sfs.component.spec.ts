import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBankSfsComponent } from './select-bank-sfs.component';

describe('SelectBankSfsComponent', () => {
  let component: SelectBankSfsComponent;
  let fixture: ComponentFixture<SelectBankSfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBankSfsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectBankSfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
