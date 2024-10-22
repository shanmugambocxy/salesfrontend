import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankifsccodeComponent } from './bankifsccode.component';

describe('BankifsccodeComponent', () => {
  let component: BankifsccodeComponent;
  let fixture: ComponentFixture<BankifsccodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankifsccodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankifsccodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
